const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [16, 32, 48, 180];
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  const svgBuffer = await fs.readFile(path.join(publicDir, 'favicon.svg'));

  // Generate PNGs
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(
        publicDir,
        size === 180
          ? 'apple-touch-icon.png'
          : size === 48
          ? 'favicon.ico'
          : `favicon-${size}x${size}.png`
      ));
  }

  console.log('Favicons generated successfully!');
}

generateFavicons().catch(console.error);
