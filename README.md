# Whiteout Survivor Calculator

A comprehensive web-based calculator for the Whiteout Survivor game that helps players plan their advancement goals and resource requirements.

## Features

- **Resource Planning**: Calculate meat, wood, coal, iron, and time requirements for building upgrades
- **Cumulative Calculations**: Plan multiple level upgrades with cumulative resource requirements
- **Speed Boost Integration**: Account for construction and research speed boosts
- **Building Dependencies**: View prerequisite building requirements
- **Game Data Integration**: Accurate data for all buildings including Furnace (levels 1-30)
- **Persistent Settings**: Remember your preferences across sessions
- **Responsive Design**: Works on desktop and mobile devices

## Game Buildings Supported

### Main Building
- **Furnace** (Levels 1-30) - The main building that caps all other buildings

### Resource Buildings
- Coal Mine, Sawmill, Iron Mine, Hunter's Station (all capped by Furnace level)

### Starter Buildings
- Clinic (Max Level 10)
- Shelters 1-10 (Max Level 10 each)
- Cook House (Max Level 10)

### Troop Buildings
- Infantry Camp, Marksman Camp, Lancer Camp (all capped by Furnace level)

### Support Buildings
- Research Center, Storehouse, Infirmary, Embassy, Command Center (all capped by Furnace level)

### Special Buildings
- Hero Hall (One-time cost)
- Barricade (Sporadic leveling)

## Live Demo

🌐 **Access the calculator**: [https://djmzsamantha.github.io/whiteout-survival-calculator](https://djmzsamantha.github.io/whiteout-survival-calculator)

## Local Development

### Prerequisites
- Python 3.x (for local server)
- Modern web browser

### Setup
1. Clone the repository: `git clone https://github.com/djmzsamantha/whiteout-survival-calculator.git`
2. Navigate to the project directory: `cd whiteout-survival-calculator`
3. Start the local server: `python3 -m http.server 8000`
4. Open `http://localhost:8000` in your browser

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Manual Deployment Steps
1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Update for deployment"
   git push origin main
   ```

3. **Monitor deployment**:
   - Check the "Actions" tab in your repository
   - Wait for the deployment workflow to complete
   - **Access** your site at `https://djmzsamantha.github.io/whiteout-survival-calculator`

## Game Data

The calculator includes comprehensive game data for:
- Building costs and requirements
- Level progression multipliers
- Time requirements
- Building dependencies
- Resource calculations

All data is based on actual game mechanics and is regularly updated.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the developer through the game community

---

**Note**: This calculator is designed for players level 20+ and assumes the Furnace as the primary building goal.

## File Structure

```
whiteout-survivor-calculator/
├── index.html              # Main application file
├── styles.css              # Styling and responsive design
├── script.js               # Game logic and calculations
├── gameData.js             # Game data and building requirements
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
