#!/bin/bash
set -e

echo "🔧 Building Codelabs Catalog..."

# 1. Download precompiled claat binary (Linux x64)
echo "📦 Downloading claat from Bit-Blazer/codelab-tools..."
wget -q "https://github.com/Bit-Blazer/codelab-tools/releases/latest/download/claat-linux-amd64" -O claat
chmod +x claat

# 2. Export all markdown files from codelabs/ to root
echo "📝 Exporting markdown files to HTML..."
if [ -d "codelabs" ]; then
  for mdfile in codelabs/*.md; do
    if [ -f "$mdfile" ]; then
      echo "  - Exporting $(basename "$mdfile")..."
      ./claat export -o . "$mdfile"
    fi
  done
else
  echo "⚠️  No codelabs/ directory found, creating it..."
  mkdir -p codelabs
fi

# 3. Build catalog index
echo "📚 Building catalog index..."
node build-index.js . codelabs.json

echo "✅ Build complete!"
echo "📊 Generated codelabs:"
ls -d */ 2>/dev/null | grep -v -E "^(codelabs|functions|worker|.git|.github)/" || echo "  (none yet)"
