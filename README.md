# Autonomous Tech Earnings Scout

🤖 **Autonomous investment research agent** that discovers upcoming tech company earnings, analyzes fundamentals, and scores long-term investment opportunities.

Built on the Claude Agent SDK with fully autonomous operation - no manual data entry, no API keys to manage.

## Overview

This agent automatically:
- 🔍 **Discovers** tech earnings dates (AI/ML, Cloud/SaaS, AWS ecosystem)
- 📊 **Researches** fundamentals (revenue growth, margins, ROIC, moat strength)
- 💯 **Scores** stocks 0-100 based on long-term investment potential
- 📝 **Drafts** investment theses with specific catalysts and risks
- 💾 **Catalogs** everything in structured JSON for analysis

**Investment Focus:** Long-term growth (3-12 months) with emphasis on fundamentals over momentum.

## Quick Start

### Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (fast Python package manager)
- Claude Code CLI authentication (already configured if you're using Claude Code)

### Installation

```bash
git clone https://github.com/stxkxs/autonomous-earnings-scout.git
cd autonomous-earnings-scout

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
```

### Run the Agent

```bash
# Default: AI/ML + Cloud/SaaS + AWS ecosystem, next 60 days
python -m src.main

# Focus on AI companies only
python -m src.main --sectors ai_ml

# Large-cap stocks only
python -m src.main --market-cap large mega

# High-conviction picks (score 85+)
python -m src.main --min-score 85

# Short timeframe (next 30 days)
python -m src.main --days-ahead 30

# Custom configuration
python -m src.main --sectors ai_ml cloud_saas --market-cap large --days-ahead 45 --max-iterations 10
```

## Dashboard

Interactive Next.js dashboard for exploring earnings opportunities discovered by the agent.

### Running the UI

```bash
cd ui
npm install
npm run dev

# Open http://localhost:3000
```

### Data Connection

The dashboard reads from `ui/public/data/earnings.json`. After running the agent, copy the output:

```bash
# Run agent first
python -m src.main --max-iterations 10

# Copy data to UI
mkdir -p ui/public/data
cp output/data/earnings.json ui/public/data/
```

The dashboard will display your earnings opportunities. Re-run the copy command after each agent run to refresh the data.

### Features

- 📊 Real-time stats (total opportunities, priority picks, average score)
- 🔍 Advanced filtering (search, score range, sectors, earnings timeframe)
- 💳 Rich stock cards with priority badges and key metrics
- 📱 Responsive design with dark mode support
- ⚡ Smooth animations and polished UI

See [`ui/README.md`](ui/README.md) for details.

## How It Works

### 1. Autonomous Discovery

The agent uses `WebSearch` to find earnings dates from public sources:
- Earnings calendars (Earnings Whispers, Nasdaq, Yahoo Finance)
- Sector-specific searches (AI chips, cloud software, cybersecurity)
- Company-specific queries (NVDA, CRM, SNOW, etc.)

### 2. Fundamental Research

For each stock, the agent gathers:
- **Price data**: Current price, 52-week range, market cap
- **Fundamentals**: Revenue growth, margins (gross/FCF), ROIC, debt levels
- **Competitive position**: Market share, moat strength, differentiation
- **Growth signals**: AI/cloud mentions, TAM expansion, product launches
- **Sentiment**: Analyst ratings, price targets, insider activity
- **Valuation**: P/E, PEG, relative multiples

### 3. Scoring Algorithm (0-100)

**Fundamentals (60 pts):**
- Revenue growth >30% YoY: 15 pts
- Gross margin >65%: 10 pts
- FCF margin >25%: 10 pts
- ROIC >20%: 10 pts
- Low debt (D/E <0.5): 5 pts
- Wide moat: 10 pts

**Growth Durability (25 pts):**
- TAM expansion: 10 pts
- Competitive position: 10 pts
- Product differentiation: 5 pts

**Valuation (10 pts):**
- PEG ratio <2.0: 5 pts
- Growth justifies premium: 5 pts

**Sentiment (5 pts):**
- Analyst consensus: 3 pts
- Insider activity: 2 pts

### 4. Investment Materials

For each stock scoring ≥75, the agent drafts:
- **Investment thesis** (2-3 sentences on why it's compelling long-term)
- **Catalysts** (3-5 specific drivers that could push the stock higher)
- **Risks** (3-5 concrete threats or concerns)

### 5. Output

Generated files in `output/` directory:

**`data/earnings.json`** - Complete catalog:
```json
{
  "ticker": "NVDA",
  "company": "NVIDIA Corporation",
  "sector": "AI/ML Infrastructure",
  "earnings_date": "2026-01-15",
  "match_score": 92,
  "investment_thesis": "...",
  "catalysts": [...],
  "risks": [...],
  "fundamentals": {...},
  "analyst_sentiment": {...},
  "valuation_metrics": {...}
}
```

**`earnings_summary.md`** - Human-readable summary:
- Grouped by week
- Priority picks highlighted
- Sector distribution
- Quick stats

## CLI Arguments

| Argument | Options | Default | Description |
|----------|---------|---------|-------------|
| `--sectors` | `ai_ml`, `cloud_saas`, `aws_ecosystem`, `semiconductors`, `cybersecurity`, `fintech`, `all` | `ai_ml cloud_saas aws_ecosystem` | Sectors to research |
| `--market-cap` | `small`, `mid`, `large`, `mega`, `all` | `all` | Market cap filter |
| `--days-ahead` | Integer | `60` | Look N days ahead for earnings |
| `--min-score` | 0-100 | `75` | Minimum investment score |
| `--max-iterations` | Integer | `20` | Max agent loop iterations |
| `--project-dir` | Path | `./output` | Output directory |
| `--model` | Model name | `claude-sonnet-4-5` | Claude model to use |

## Usage Examples

### High-Quality AI Stocks

```bash
python -m src.main --sectors ai_ml --min-score 85
```

Finds AI/ML infrastructure companies with investment scores ≥85 (exceptional fundamentals + growth).

### AWS Ecosystem Plays

```bash
python -m src.main --sectors aws_ecosystem --market-cap mid large
```

Discovers mid-to-large cap companies building on or benefiting from AWS.

### Short-Term Earnings Calendar

```bash
python -m src.main --days-ahead 14 --sectors all
```

Creates a 2-week earnings calendar across all tech sectors.

### Mega-Cap Tech Only

```bash
python -m src.main --market-cap mega --min-score 80
```

Focuses on mega-cap tech (>$200B) with strong fundamentals.

## Resumable Sessions

The agent automatically saves progress. If interrupted (Ctrl+C), simply run the same command again:

```bash
# First run (interrupted after 5 iterations)
python -m src.main --sectors ai_ml

# Resume (continues where it left off)
python -m src.main --sectors ai_ml
```

The agent:
- Reads existing `output/data/earnings.json`
- Skips duplicate tickers
- Appends new stocks found
- Updates summary

## Data Sources

All data from **public sources** (no API keys required):

- **Yahoo Finance** - Stock prices, analyst ratings, fundamentals
- **Nasdaq.com** - Earnings calendar, market data
- **Earnings Whispers** - Consensus estimates, earnings dates
- **SEC EDGAR** - Insider trading (Form 4), 10-Q/10-K filings
- **OpenInsider** - Aggregated insider activity
- **Google News** - Recent headlines and sentiment
- **TechCrunch, Bloomberg** - Product launches, partnerships

Accessed via `WebSearch` and `WebFetch` tools provided by Claude Agent SDK.

## Output Structure

```
output/
├── data/
│   └── earnings.json           # Complete catalog (main output)
├── earnings_summary.md          # Human-readable summary
├── investment_profile.txt       # Your research criteria
├── feature_list.json           # Progress tracking
└── .claude_settings.json       # Agent permissions
```

## Scoring Tiers

- **90-100**: Exceptional long-term opportunities (wide moat + strong growth)
- **80-89**: High-quality growth stocks
- **75-79**: Solid fundamentals, worth watching
- **<75**: Filtered out (not included in catalog)

## Example Output

From `earnings_summary.md`:

```markdown
## Week of January 13-17, 2026

### Priority Picks (Score 90+)

**NVDA** (Score: 92) - AI/ML Infrastructure - Jan 15 AMC
- Thesis: Dominant datacenter GPU leader with 90%+ share...
- Key Catalyst: Blackwell architecture production ramp

**MDB** (Score: 91) - Cloud/SaaS - Jan 16 AMC
- Thesis: Leading modern database with Atlas cloud growth...
- Key Catalyst: AI workload adoption (vector search)

### High Quality (Score 80-89)

**AMD** (Score: 86) - Semiconductors - Jan 14 AMC
- Thesis: MI300X gaining AI market share vs NVIDIA...
- Key Catalyst: Datacenter GPU revenue inflection
```

## Customizing Research

Edit `prompts/investment_profile.txt` to adjust:
- Investment style (growth vs value)
- Scoring weights
- Sector preferences
- Risk tolerance
- Research priorities

The agent reads this file on every run to guide its research.

## Troubleshooting

### "FileNotFoundError: Prompt not found"

Ensure you're running from the project root:
```bash
cd autonomous-earnings-scout
python -m src.main
```

### "No stocks found"

Try expanding search:
```bash
# Broaden sectors
python -m src.main --sectors all

# Extend timeframe
python -m src.main --days-ahead 90

# Lower score threshold
python -m src.main --min-score 70
```

### Agent finds duplicates

This shouldn't happen (deduplication is built-in), but if it does:
```bash
# Delete output and start fresh
rm -rf output/
python -m src.main
```

## Project Structure

```
autonomous-earnings-scout/
├── src/
│   ├── main.py              # CLI entry point
│   ├── agent.py             # Agent iteration loop
│   ├── client.py            # Claude Agent SDK config
│   ├── prompts.py           # Prompt loading utilities
│   └── progress.py          # Progress tracking
├── prompts/
│   ├── investment_profile.txt       # Investment criteria (customizable)
│   ├── initializer_prompt.md        # First-run instructions
│   └── continuation_prompt.md       # Continuation instructions
├── ui/                       # Next.js dashboard
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   └── public/
│       └── data/
│           └── earnings.json # Copy from output/data/earnings.json
├── output/                   # Generated data (gitignored)
├── pyproject.toml
└── README.md
```

## Roadmap

Future enhancements:
- [ ] Backtesting (track actual post-earnings moves vs scores)
- [ ] Portfolio tracker (mark stocks as "invested" and track P&L)
- [ ] Weekly email digest (top 5 upcoming earnings)
- [ ] Valuation module (DCF calculator, comps analysis)
- [ ] Options data (IV rank, put/call ratio)
- [ ] Comparison mode (side-by-side stock analysis)

## Contributing

This is a personal project but suggestions welcome! Open an issue or PR.

## License

MIT License - see LICENSE file

## Acknowledgments

- Built on [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- Architecture inspired by the autonomous-job-search pattern
- Data from public sources (Yahoo Finance, Nasdaq, Earnings Whispers, etc.)

---

**Disclaimer:** This tool is for research purposes only. Not financial advice. Do your own due diligence before making investment decisions.
