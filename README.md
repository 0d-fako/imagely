# 🖼️ Imagely - Chrome Extension

[![GitHub Actions](https://github.com/0d-fako/imagely/workflows/Imagely%20Chrome%20Extension/badge.svg)](https://github.com/yourusername/imagely/actions)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/imagely/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> A powerful Chrome extension that downloads and organizes all images from any webpage into a structured zip file.

## ✨ Features

- 🚀 **One-click download** - Download all images from any webpage instantly
- 📁 **Smart organization** - Automatically categorizes images by size and creates folder structure
- 📦 **Zip packaging** - Downloads everything as a single, organized zip file
- 🔍 **Intelligent filtering** - Finds both regular images and CSS background images
- 📊 **Size categorization** - Organizes images into thumbnail, small, medium, and large folders
- 🏷️ **Smart naming** - Creates meaningful filenames with dimensions
- ⚡ **Progress tracking** - Real-time download progress and status updates
- 🛡️ **Safe downloads** - Handles errors gracefully and filters out invalid images

##  Installation

### From Chrome Web Store
*Coming soon - extension is currently in development*

### Manual Installation (Developer Mode)

1. **Download the extension:**
   ```bash
   git clone https://github.com/yourusername/imagely.git
   cd imagely
   ```

2. **Load into Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `imagely` folder

3. **Ready to use!** 🎉
   - The extension icon will appear in your browser toolbar

## 🚀 Usage

1. **Navigate** to any webpage with images (news sites, social media, galleries, etc.)
2. **Click** the Imagely extension icon in your toolbar
3. **Click** "Download Images" button
4. **Wait** for the extension to scan and process images
5. **Download** the organized zip file automatically starts

### Example Output Structure

```
reddit.com_images_2025-08-14.zip
└── reddit.com/
    └── 2025-08-14/
        ├── thumbnail/          # Images < 200px
        │   ├── icon_32x32.png
        │   └── avatar_64x64.jpg
        ├── small/              # Images 200-800px
        │   └── profile_400x400.jpg
        ├── medium/             # Images 800-1920px
        │   └── post_1200x800.jpg
        └── large/              # Images > 1920px
            └── wallpaper_3840x2160.jpg
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ (for development tools)
- Chrome browser
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/imagely.git
cd imagely

# Install development dependencies (optional)
npm install

# Load extension in Chrome
# Follow manual installation steps above
```

### Project Structure

```
imagely/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.css              # Popup styling
├── popup.js               # Main UI logic
├── background.js          # Download and zip logic
├── content.js             # Content script (minimal)
├── .github/
│   └── workflows/
│       └── imagely.yml    # GitHub Actions workflow
├── package.json           # Development dependencies
└── README.md              # This file
```

### Key Technologies

- **Manifest V3** - Latest Chrome extension platform
- **JSZip** - Client-side zip file creation
- **Chrome APIs** - Downloads, tabs, scripting APIs
- **Vanilla JavaScript** - No frameworks, pure JS
- **GitHub Actions** - Automated testing and building

### Development Scripts

```bash
# Lint JavaScript files
npm run lint

# Validate extension files
npm run validate

# Build extension package
npm run build

# Create zip package
npm run package

# Run all tests
npm test
```

## 📋 Size Categories

Images are automatically categorized based on their largest dimension:

| Category | Size Range | Typical Use Cases |
|----------|------------|------------------|
| **Thumbnail** | < 200px | Icons, avatars, small graphics |
| **Small** | 200-800px | Profile pictures, thumbnails |
| **Medium** | 800-1920px | Standard web images, photos |
| **Large** | > 1920px | High-resolution photos, wallpapers |

## 🔧 Configuration

The extension works out of the box with no configuration needed. However, you can modify the size thresholds by editing the `getSizeCategory()` function in `popup.js` and `background.js`.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** thoroughly with the development setup
5. **Commit** your changes: `git commit -m 'Add amazing feature'`
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Create** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Test on multiple websites before submitting
- Ensure the extension works with various image formats
- Update documentation for any new features
- Add appropriate error handling

##  Bug Reports & Feature Requests

Found a bug or have a feature idea? Please [open an issue](https://github.com/0d-fako/imagely/issues) with:

- **Bug reports**: Steps to reproduce, expected vs actual behavior, browser version
- **Feature requests**: Clear description of the feature and its use case

## 📜 Privacy & Permissions

Imagely respects your privacy:

- **ActiveTab permission**: Only accesses the current active tab when you click the extension
- **Downloads permission**: Required to save the zip file to your computer
- **No data collection**: We don't collect, store, or transmit any personal data
- **Local processing**: All image processing happens locally in your browser

## 🔄 Changelog

### Version 1.0.0 (2025-08-14)
- ✨ Initial release
- 🖼️ Download all images from webpages
- 📁 Organize images by size categories
- 📦 Create structured zip files
- 🎯 Smart image detection (img tags + background images)
- 📊 Real-time progress tracking

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [JSZip](https://stuk.github.io/jszip/) - Client-side zip file creation
- Chrome Extensions documentation and community
- All contributors and users who provide feedback

## 📞 Support

- 📧 **Email**: od.fakorede@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/0d-fako/imagely/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/0d-fako/imagely/discussions)

---

<div align="center">

**Made with ❤️ by [Olumide D. Fakorede](https://github.com/0d-fako)**

⭐ **Star this repo if you find it useful!** ⭐

</div>