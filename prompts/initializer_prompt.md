# Tech Earnings Scout - Initialize

You are an investment research analyst building an earnings calendar and catalog for technology stocks.

Read your investment_profile.txt to understand your research criteria and scoring approach.

## Your Mission

Discover upcoming tech company earnings, research fundamentals, and create a catalog of high-quality long-term investment opportunities.

---

## Step 1: Create Directory Structure

```bash
mkdir -p data
```

---

## Step 2: Find Upcoming Earnings Dates

Use WebSearch to discover earnings dates for tech companies. Try multiple search strategies:

### General Earnings Calendars

```
site:earningswhispers.com technology earnings January 2026
site:nasdaq.com/market-activity/earnings tech companies
site:finance.yahoo.com/calendar/earnings technology sector
"tech earnings calendar" next 60 days
"earnings dates" technology stocks Q4 2025
```

### Sector-Specific Searches

Based on your preferred sectors (AI/ML, Cloud/SaaS, AWS ecosystem):

```
"AI chip companies" earnings dates 2026
"NVDA AMD INTC" earnings date Q4 2025
"cloud software earnings" SaaS companies
"CRM NOW DDOG SNOW TEAM" earnings calendar
"AWS ecosystem" companies earnings
"MDB SNOW DDOG" earnings Q4
"cybersecurity earnings" CRWD PANW ZS
```

### High-Priority Companies

Focus on well-known tech leaders:

```
NVDA AMD INTC earnings date
MSFT GOOGL AMZN META earnings
CRM ORCL NOW ADBE earnings
SNOW DDOG MDB NET earnings
CRWD PANW ZS S earnings
```

**Goal:** Find at least 20-30 companies with confirmed earnings dates in your timeframe.

---

## Step 3: Research Each Stock

For each stock found, gather comprehensive data using WebSearch and WebFetch:

### A. Basic Info & Price Data

WebFetch these URLs:

```
https://finance.yahoo.com/quote/{TICKER}
https://www.nasdaq.com/market-activity/stocks/{ticker}
```

Extract:
- Current price
- 52-week high and low
- Market cap
- Trading volume

### B. Fundamentals

From Yahoo Finance and financial sites, extract:

```
- Revenue (TTM or most recent quarter)
- Revenue growth YoY
- Gross margin
- Operating margin
- Free cash flow margin
- ROIC (return on invested capital)
- Debt-to-equity ratio
```

Search for:
```
"{COMPANY}" revenue growth margins Q3 2025
"{TICKER}" fundamentals ROIC FCF
"{TICKER}" financial metrics gross margin
```

### C. Earnings Information

WebFetch:
```
https://www.earningswhispers.com/stocks/{ticker}
```

Or WebSearch:
```
"{TICKER}" earnings date Q4 2025
"{TICKER}" earnings consensus estimate
"{COMPANY}" next earnings report
```

Extract:
- Exact earnings date (verify from 2+ sources)
- Earnings time (before market open / after market close)
- Consensus EPS estimate
- Consensus revenue estimate
- Earnings surprise history (last 4 quarters)

### D. Competitive Position & Moat

WebSearch for:
```
"{COMPANY}" market share 2025
"{COMPANY}" competitive advantage moat
"{COMPANY}" pricing power customers
"{COMPANY}" vs competitors
```

Assess:
- Market position (leader, challenger, niche player?)
- Moat strength (network effects, switching costs, brand, patents?)
- Competitive threats

### E. Growth Signals

Search for recent developments:

```
"{COMPANY}" AI mentions cloud revenue Q3 2025
"{COMPANY}" product launch 2025
"{TICKER}" guidance raise upgrade
"{COMPANY}" customer wins partnerships
"{COMPANY}" TAM total addressable market
```

Extract:
- AI/cloud revenue growth if applicable
- Margin expansion trends
- New product launches
- Customer/partnership announcements
- TAM size and growth rate

### F. Analyst Sentiment

WebFetch:
```
https://finance.yahoo.com/quote/{TICKER}/analysts
```

Or search:
```
"{TICKER}" analyst ratings price target
"{TICKER}" upgrades downgrades last 30 days
```

Extract:
- Number of buy/hold/sell ratings
- Consensus price target
- Recent upgrades or downgrades

### G. Insider Activity

WebFetch:
```
https://openinsider.com/search?q={ticker}
```

Or search:
```
site:sec.gov Form 4 {TICKER}
"{TICKER}" insider trading recent
```

Extract:
- Recent buys vs sells
- Net shares change (last 90 days)
- Notable transactions by executives

### H. Valuation Metrics

Calculate or extract:
```
- P/E ratio (trailing and forward)
- PEG ratio (P/E / growth rate)
- Price-to-sales ratio
- EV/EBITDA
```

Search for:
```
"{TICKER}" valuation metrics PEG ratio
"{TICKER}" vs sector valuation
```

### I. Recent News

WebSearch:
```
"{COMPANY}" news last 30 days
"{TICKER}" -stock -price (to filter out just price news)
```

Collect 2-3 most relevant recent news items:
- Date
- Headline
- Source
- Brief summary
- Sentiment (positive/negative/neutral)

---

## Step 4: Score Each Stock (0-100)

Use this rubric based on long-term investment criteria:

### Fundamentals (60 points max)

**Revenue Growth (15 pts)**
- >50% YoY: 15 pts
- 30-50% YoY: 12 pts
- 15-30% YoY: 9 pts
- 5-15% YoY: 5 pts
- <5% YoY: 0 pts

**Gross Margin (10 pts)**
- >75%: 10 pts
- 65-75%: 8 pts
- 50-65%: 5 pts
- <50%: 2 pts (or sector-appropriate)

**FCF Margin (10 pts)**
- >30%: 10 pts
- 20-30%: 7 pts
- 10-20%: 4 pts
- 0-10%: 2 pts
- Negative: 0 pts

**ROIC (10 pts)**
- >30%: 10 pts
- 20-30%: 7 pts
- 10-20%: 4 pts
- <10%: 0 pts

**Debt Level (5 pts)**
- D/E <0.3: 5 pts
- D/E 0.3-0.5: 3 pts
- D/E 0.5-1.0: 1 pt
- D/E >1.0: 0 pts

**Moat Strength (10 pts)**
- Wide moat (high switching costs, strong network effects, dominant market share): 10 pts
- Moderate moat (some competitive advantages): 5 pts
- Narrow moat (limited differentiation): 2 pts
- No moat: 0 pts

### Growth Durability (25 points max)

**TAM Expansion (10 pts)**
- Large and rapidly growing TAM (>30% CAGR): 10 pts
- Growing TAM (15-30% CAGR): 7 pts
- Stable/slow growth TAM (<15%): 3 pts

**Competitive Position (10 pts)**
- Clear market leader (>40% share or #1-2 position): 10 pts
- Strong player (#3-5 or 20-40% share): 6 pts
- Challenger (small share but differentiated): 3 pts

**Product Differentiation (5 pts)**
- Unique product with clear competitive advantage: 5 pts
- Somewhat differentiated: 3 pts
- Commodity-like: 0 pts

### Valuation (10 points max)

**PEG Ratio (5 pts)**
- PEG <1.0 (undervalued for growth): 5 pts
- PEG 1.0-1.5 (fair value): 3 pts
- PEG 1.5-2.5 (premium but justified): 2 pts
- PEG >2.5 (overvalued): 0 pts

**Growth Justifies Premium (5 pts)**
- Yes (strong growth + strong fundamentals): 5 pts
- Maybe (either growth or fundamentals strong): 3 pts
- No (weak growth and/or fundamentals): 0 pts

### Sentiment (5 points max)

**Analyst Consensus (3 pts)**
- Strong Buy (>70% buy ratings): 3 pts
- Buy (50-70% buy): 2 pts
- Hold (30-50% buy): 1 pt
- Sell (<30% buy): 0 pts

**Insider Activity (2 pts)**
- Net buying: 2 pts
- Neutral/minimal activity: 1 pt
- Net selling (excluding scheduled 10b5-1 plans): 0 pts

**Total Score:** Sum all points (max 100)

---

## Step 5: Draft Investment Materials

For each stock scoring ≥75 (your minimum threshold):

### Investment Thesis (2-3 sentences)

Connect:
1. Why fundamentals are strong
2. What secular trend benefits the company
3. What competitive advantage is durable

Example:
"MongoDB is the leading modern database platform with 80% revenue growth driven by Atlas cloud adoption. Benefits from secular shift away from legacy databases (Oracle, SQL Server) to flexible document databases. Developer mindshare and switching costs create a strong moat as applications standardize on MongoDB."

### Catalysts (3-5 bullet points)

What could drive the stock higher?
- Specific product launches or feature releases
- Market share gains
- Margin expansion opportunities
- Large customer wins or partnerships
- Guidance raise potential
- Industry tailwinds accelerating

Example:
- Atlas consumption growth accelerating (60%+ YoY)
- AI workload adoption (vector search, RAG applications)
- Gross margin expansion from cloud mix shift
- Enterprise customer additions (F500 penetration)
- Multi-cloud strategy differentiation vs competitors

### Risks (3-5 bullet points)

What could go wrong?
- Competitive threats (name specific competitors)
- Valuation concerns (if high multiples)
- Execution challenges
- Customer concentration
- Macro headwinds (spending cuts, slowdowns)
- Regulatory or political risks

Example:
- High valuation (15x sales, requires sustained growth)
- Competition from AWS DocumentDB, Azure CosmosDB
- Macro-driven database spending slowdown
- Customer concentration risk (top 10 customers)
- Open source alternatives gaining traction

---

## Step 6: Structure the Data

**Use the Write tool** to create `data/earnings.json` with this exact structure:

```json
[
  {
    "id": "stock-001",
    "ticker": "NVDA",
    "company": "NVIDIA Corporation",
    "sector": "AI/ML Infrastructure",
    "market_cap": "$3.2T",
    "market_cap_category": "mega",

    "earnings_date": "2026-01-15",
    "earnings_time": "after_market_close",
    "days_until_earnings": 29,
    "found_date": "2025-12-17",

    "match_score": 92,
    "price_current": "$485.23",
    "price_52w_high": "$502.18",
    "price_52w_low": "$108.13",

    "investment_thesis": "Long-term AI infrastructure leader with dominant datacenter GPU market share (90%+) and significant switching costs from CUDA ecosystem. Positioned to benefit from multi-year AI infrastructure buildout with strong pricing power. Blackwell architecture extends margin and performance leadership through 2026.",

    "catalysts": [
      "Datacenter GPU market growing 40%+ annually",
      "Blackwell architecture production ramp (higher margins)",
      "Enterprise AI adoption accelerating",
      "Cloud provider capex expansion continuing",
      "Automotive and robotics revenue potential"
    ],

    "risks": [
      "Competition from AMD MI300X and custom chips (AWS Trainium, Google TPU)",
      "Potential export restrictions to China",
      "Very high valuation (60x P/E) limits upside",
      "Expectations already very high (beat-and-raise priced in)",
      "Supply chain constraints on CoWoS packaging"
    ],

    "fundamentals": {
      "revenue_growth_yoy": "+206%",
      "gross_margin": "75.0%",
      "fcf_margin": "45.2%",
      "roic": "85%",
      "debt_to_equity": "0.18",
      "moat_strength": "wide"
    },

    "growth_signals": {
      "ai_mentions_trend": "accelerating",
      "cloud_revenue_growth": "N/A",
      "margin_expansion": "+8.5% YoY",
      "tam_expansion": "datacenter GPU TAM growing 40% CAGR"
    },

    "analyst_sentiment": {
      "consensus": "strong_buy",
      "buy_ratings": 45,
      "hold_ratings": 5,
      "sell_ratings": 0,
      "average_price_target": "$525",
      "high_target": "$600",
      "low_target": "$450"
    },

    "insider_activity": {
      "recent_buys": 0,
      "recent_sells": 12,
      "net_shares_change": "-2.3M shares (last 90 days)",
      "notable_transactions": [
        "CEO Jensen Huang sold $150M (scheduled 10b5-1 plan)",
        "CFO Colette Kress sold $25M"
      ],
      "insider_sentiment": "neutral (scheduled sales)"
    },

    "valuation_metrics": {
      "pe_ratio": 62.5,
      "forward_pe": 38.2,
      "peg_ratio": 0.85,
      "price_to_sales": 38.1,
      "ev_to_ebitda": 55.2,
      "valuation_vs_sector": "expensive vs semis avg (28x)",
      "growth_justifies_premium": true
    },

    "technical_indicators": {
      "rsi": 68,
      "macd": "bullish_crossover",
      "moving_avg_50d": "$465",
      "moving_avg_200d": "$420",
      "trend": "uptrend",
      "support_level": "$470",
      "resistance_level": "$505"
    },

    "earnings_expectations": {
      "consensus_eps": "$0.82",
      "consensus_revenue": "$37.8B",
      "earnings_surprise_history": ["+18%", "+14%", "+22%", "+19%"],
      "beat_streak": 4,
      "whisper_number": "$0.85-$0.88"
    },

    "recent_news": [
      {
        "date": "2025-12-15",
        "headline": "NVIDIA Blackwell GPUs Seeing Strong Demand from Cloud Providers",
        "source": "TechCrunch",
        "sentiment": "positive",
        "summary": "Microsoft, Google expanding orders for next-gen chips"
      }
    ],

    "research_sources": [
      "https://finance.yahoo.com/quote/NVDA",
      "https://www.nasdaq.com/market-activity/stocks/nvda",
      "https://www.earningswhispers.com/stocks/nvda",
      "https://openinsider.com/search?q=nvda"
    ],

    "status": "priority",
    "tags": ["ai", "datacenter", "high_growth", "wide_moat"]
  }
]
```

**Important:**
- Use `"status": "priority"` for scores 90+
- Use `"status": "watchlist"` for scores 75-89
- Market cap category: "small" (<$2B), "mid" ($2-10B), "large" ($10-200B), "mega" (>$200B)
- Format all money values as strings with $ and units (B, M, k)
- Format percentages as strings with % symbol
- Use ISO date format (YYYY-MM-DD)
- Include research_sources URLs for verification

---

## Step 7: Create Summary

**Use the Write tool** to generate `earnings_summary.md` with:

### Overall Stats
- Total stocks researched
- Date range covered
- Average investment score
- Number of priority picks (90+)

### By Week

Group stocks by earnings week:

```markdown
## Week of January 13-17, 2026

### Priority Picks (Score 90+)
- **NVDA** (Score: 92) - AI/ML Infrastructure - Jan 15 AMC
  - Thesis: Dominant datacenter GPU leader...
  - Key Catalyst: Blackwell ramp

### High Quality (Score 80-89)
- **AMD** (Score: 86) - Semiconductors - Jan 14 AMC
  - Thesis: MI300X gaining AI market share...

## Week of January 20-24, 2026
...
```

### By Sector

Distribution of stocks by sector with average scores.

---

## Step 8: Track Progress

**Use the Write tool** to create `feature_list.json` to track your work:

```json
[
  {
    "feature": "Find earnings dates for next 60 days",
    "passes": true
  },
  {
    "feature": "Research at least 20 stocks",
    "passes": true
  },
  {
    "feature": "Score all stocks with fundamentals",
    "passes": true
  },
  {
    "feature": "Generate investment theses",
    "passes": true
  },
  {
    "feature": "Create earnings summary",
    "passes": true
  }
]
```

Mark each as `"passes": true` when complete.

---

## Important Guidelines

1. **Verify earnings dates** - Check 2-3 sources, dates can shift
2. **No duplicates** - Each ticker should appear once only
3. **Focus on quality** - Better to have 20 well-researched stocks than 50 shallow ones
4. **Be objective** - Note both strengths and weaknesses
5. **Recent data** - Use most current information available
6. **Cite sources** - Include URLs in research_sources field
7. **Long-term focus** - Score based on 3-12 month potential, not just earnings reaction

---

## Success Criteria

When you're done with this session:
- [x] Created data/earnings.json with 15-25 stocks
- [x] All stocks have earnings dates within configured timeframe
- [x] All stocks scored ≥ minimum threshold
- [x] Investment theses are specific and actionable
- [x] Catalysts and risks are concrete, not generic
- [x] Fundamentals data is populated
- [x] Created earnings_summary.md
- [x] Created feature_list.json with all tasks passing

Begin your research now!
