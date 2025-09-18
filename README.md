# Minesweeper

My implementation of the classic game Minesweeper, built with React and Vite. The latest version of the game can be accessed at [this page](https://rambo37.github.io/minesweeper/).

## Features

- Classic Minesweeper gameplay with multiple difficulty levels
- Custom game mode with adjustable board size and mine count
- Responsive design with different square sizes
- Time tracking

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **JavaScript/JSX** - Programming language
- **CSS3** - Styling
- **SVG** - Game icons and graphics

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rambo37/minesweeper.git
cd minesweeper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run deploy` - Deploy to GitHub Pages

## How to Play

1. **Left-click** on a square to reveal it
2. **Right-click** on a square to flag/unflag it as a mine
3. Numbers show how many mines are adjacent to that square
4. Use logic to determine where mines are located
5. Open all squares without mines to win!

## Difficulty Levels

- **Easy**: 9×9 grid with 10 mines
- **Medium**: 16×16 grid with 40 mines  
- **Expert**: 16×30 grid with 99 mines
- **Custom**: Choose your own grid size and mine count

## Deployment

This project is automatically deployed to GitHub Pages using Vite's build system. The production build is optimized and served from the `gh-pages` branch.

## Migration Notes

This project was migrated from Create React App to Vite for improved development experience and faster build times.

