@echo off
setlocal enabledelayedexpansion

echo Building Codelabs Catalog...

REM Download claat binary for Windows
echo Downloading claat from Bit-Blazer/codelab-tools...
curl -sL "https://github.com/Bit-Blazer/codelab-tools/releases/latest/download/claat-windows-amd64.exe" -o claat.exe

REM Create codelabs directory if missing
if not exist codelabs\ (
  echo Creating codelabs directory...
  mkdir codelabs
)

REM Export all markdown files from codelabs/ to root
echo Exporting markdown files to HTML...
if exist codelabs\*.md (
  for %%f in (codelabs\*.md) do (
    echo   - Exporting %%~nxf...
    claat.exe export -o . "%%f"
  )
) else (
  echo No markdown files found in codelabs/
)

REM Build catalog index
echo Building catalog index...
node build-index.js . codelabs.json

echo Build complete!
echo Generated codelabs:
for /d %%d in (*) do (
  if /i not "%%d"=="codelabs" if /i not "%%d"=="worker" if /i not "%%d"=="functions" if /i not "%%d"==".git" if /i not "%%d"==".github" echo   - %%d
)

endlocal
