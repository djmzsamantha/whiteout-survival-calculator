# Whiteout Survivor Calculator

A comprehensive web-based calculator for the Whiteout Survivor game that helps players plan their advancement by calculating resource requirements, time estimates, and providing strategic tips.

## Features

### 🎯 Main Calculator
- **Building Upgrades**: Plan building upgrades with resource and time calculations
- **Furnace Progression**: Special handling for furnace's complex leveling system (1-30)

### 📊 Resource Tracking
- **Current Status**: Input your current furnace level
- **Total Requirements**: Shows complete resource needs for your goal
- **Time Estimates**: Shows how long upgrades will take




### 💡 Smart Tips
- **Strategic Advice**: Get personalized tips based on your goals and resource bottlenecks
- **Progress Breakdown**: See detailed requirements for each level or upgrade step
- **Resource Prioritization**: Learn which resources to focus on first

## How to Use

### 1. Set Your Current Status
- Enter your current furnace level (1-30)

### 2. Choose Your Goal
- **Building Upgrade**: Choose building type and target level

### 3. Calculate Requirements
- Click "Calculate Requirements" to see detailed breakdown
- Review resource needs and time estimates
- Check the progress breakdown for step-by-step requirements
- Read strategic tips for your specific situation



## Game Data Included

The calculator includes comprehensive data for:
- **Furnace Levels 1-30** with complex building dependencies and escalating resource requirements
- **Starter Buildings** (Max Level 10): Clinic, Shelters 1-10, Cook House
- **Resource Buildings** (Max Level = Furnace Level): Coal Mine, Sawmill, Iron Mine, Hunter's Station
- **Troop Buildings** (Max Level = Furnace Level): Infantry Camp, Marksman Camp, Lancer Camp
- **Support Buildings** (Max Level = Furnace Level): Research Center, Storehouse, Infirmary, Embassy, Command Center, Hero Hall
- **Defense Buildings** (Max Level = Furnace Level): Barricade
- **Research Categories**: Growth, Economy, Battle (coming soon)

## Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies required
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful winter-themed design with smooth animations
- **Real-time Calculations**: Instant results with no page reloads
- **Building Dependencies**: Shows prerequisite buildings needed for upgrades

## Getting Started

### Local Development
1. Clone the repository: `git clone https://github.com/yourusername/whiteout-survivor-calculator.git`
2. Navigate to the project directory: `cd whiteout-survivor-calculator`
3. Start a local server: `python3 -m http.server 8000`
4. Open `http://localhost:8000` in your browser
5. Start calculating your Whiteout Survivor advancement plans!

### GitHub Pages Deployment
This project is configured for automatic deployment to GitHub Pages:

1. **Fork or create** a new repository on GitHub
2. **Push** your code to the `main` branch
3. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Folder: `/ (root)`
4. **Wait** for the GitHub Action to deploy (usually takes 1-2 minutes)
5. **Access** your site at `https://yourusername.github.io/whiteout-survivor-calculator`

### Custom Domain (Optional)
To use a custom domain:
1. Add your domain to the `CNAME` file
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## File Structure

```
whiteout-survivor-calculator/
├── index.html              # Main application file
├── styles.css              # Styling and responsive design
├── script.js               # Game logic and calculations
├── 404.html                # Custom 404 error page
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine crawling rules
├── CNAME                   # Custom domain configuration
├── .github/workflows/      # GitHub Actions deployment
│   └── deploy.yml         # Automatic deployment workflow
├── package.json            # Project metadata and scripts
├── .gitignore             # Git ignore rules
└── README.md              # This documentation
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Contributing

Feel free to contribute by:
- Adding more accurate game data and building costs
- Improving the UI/UX
- Adding new calculation features
- Fixing bugs or issues
- Updating building dependencies and requirements

## Deployment

### Automatic Deployment
This project uses GitHub Actions for automatic deployment:
- Push to `main` branch triggers deployment
- Site is automatically built and deployed to GitHub Pages
- No manual build steps required

### Manual Deployment
If you prefer manual deployment:
1. Build the project (no build step required for static site)
2. Upload files to your web server
3. Ensure all files are in the root directory

## License

This project is open source and available under the MIT License.

---

**Happy calculating and good luck in Whiteout Survivor!** 🏔️❄️
