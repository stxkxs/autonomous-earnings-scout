# Earnings Scout Dashboard

Modern Next.js dashboard for visualizing and exploring earnings opportunities discovered by the autonomous agent.

## Features

- 📊 **Live data visualization** - Stats cards with real-time opportunity counts
- 🔍 **Advanced filtering** - Search, score range, sectors, earnings timeframe
- 💳 **Rich stock cards** - Score badges, earnings countdown, key metrics
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- 🌓 **Dark mode** - Automatic theme switching
- ⚡ **Smooth animations** - Framer Motion for polished transitions

## Quick Start

```bash
# From the ui/ directory
npm install

# Development server
npm run dev

# Open http://localhost:3000
```

## Data Connection

The dashboard reads from `public/data/earnings.json`. To populate data:

```bash
# From the root directory, run the agent
python -m src.main --max-iterations 10

# Copy the output to the UI
mkdir -p ui/public/data
cp output/data/earnings.json ui/public/data/
```

Refresh your browser to see the latest data. Re-run the copy command after each agent run.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## License

MIT
