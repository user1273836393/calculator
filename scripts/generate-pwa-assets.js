const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public');
const iconPath = path.join(__dirname, 'icon.png'); // Place your icon.png in scripts folder

// Create public directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons
const sizes = [192, 512];

sizes.forEach(size => {
  sharp(iconPath)
    .resize(size, size)
    .toFile(path.join(outputDir, `icon-${size}.png`), (err) => {
      if (err) throw err;
      console.log(`Generated icon-${size}.png`);
    });
});

// Generate screenshot (you can replace this with an actual screenshot)
sharp({
  create: {
    width: 1080,
    height: 1920,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#2db6b6"/>
          <text x="50%" y="50%" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle">Smart Calculator</text>
        </svg>`
      ),
      top: 0,
      left: 0
    }
  ])
  .toFile(path.join(outputDir, 'screenshot.png'), (err) => {
    if (err) throw err;
    console.log('Generated screenshot.png');
  });
