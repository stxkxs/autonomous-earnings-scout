# Tech Earnings Scout - Continue Research

Continue building your earnings catalog by discovering more tech stocks with upcoming earnings.

---

## Step 1: Load Existing Catalog

**Use the Read tool** to load `ui/public/data/earnings.json` and analyze:

```
- How many stocks already researched?
- Which tickers are already in the catalog? (list them)
- What date range is covered? (earliest to latest earnings date)
- Which sectors are represented? (AI/ML, Cloud/SaaS, AWS, etc.)
- Are there gaps? (underrepresented sectors, date ranges)
```

**CRITICAL:** You MUST check for existing tickers to avoid duplicates.

---

## Step 2: Expand Your Search

Try different search strategies to find NEW stocks not yet in your catalog:

### By Specific Companies

Search for well-known tech companies you might have missed:

```
# AI/ML Infrastructure
NVDA AMD INTC AVGO MU QCOM MRVL AMAT KLAC ASML earnings

# Cloud/SaaS
CRM ORCL NOW ADBE WDAY TEAM ZM NET SNOW DDOG MDB

# AWS Ecosystem
SNOW DDOG MDB HUBS ZS NET CFLT

# Cybersecurity
CRWD PANW ZS S OKTA FTNT

# Semiconductors
NVDA AMD INTC AVGO TSM MU QCOM MRVL

# Enterprise Software
CRM NOW WDAY ADBE ORCL SAP TEAM ZM VEEV
```

### By Sector

```
"semiconductor earnings calendar" Q4 2025
"cloud software companies" earnings dates 2026
"cybersecurity stocks" next earnings
"fintech earnings" technology companies
"AI companies" earnings upcoming
```

### By Index/ETF Holdings

```
"QQQ top holdings" earnings dates
"XLK technology ETF" holdings earnings
"SOXX semiconductor ETF" companies earnings
"WCLD cloud ETF" earnings calendar
```

### By Market Events

```
"technology earnings" next 30 days
"high growth tech" earnings calendar
"profitable SaaS companies" earnings
```

---

## Step 3: Filter Out Duplicates

**Before researching any stock:**

1. Check if ticker already exists in ui/public/data/earnings.json
2. If YES → SKIP IT (don't research again)
3. If NO → Proceed with full research

Example check:
```python
# Pseudocode
existing_tickers = [stock["ticker"] for stock in earnings_data]
if new_ticker in existing_tickers:
    print(f"Skipping {new_ticker} - already in catalog")
    continue
```

---

## Step 4: Research New Stocks

For each NEW stock found (not in existing catalog):

Follow the same research process as initializer:

1. Basic info & price data (Yahoo Finance, Nasdaq)
2. Fundamentals (revenue growth, margins, ROIC, debt)
3. Earnings info (date, time, consensus, history)
4. Competitive position & moat assessment
5. Growth signals (AI/cloud mentions, product launches)
6. Analyst sentiment (ratings, price targets)
7. Insider activity (recent buys/sells)
8. Valuation metrics (P/E, PEG, relative valuation)
9. Recent news (last 30 days)
10. Score using same rubric (0-100)
11. Draft investment thesis, catalysts, risks

---

## Step 5: Append to Catalog

**CRITICAL - DO NOT OVERWRITE:**

1. **Use the Read tool** to load existing `ui/public/data/earnings.json`
2. Parse the JSON to get the list of existing stocks
3. Add your newly researched stocks to this list (checking for duplicates by ticker)
4. Sort the combined list by `earnings_date` ascending
5. **Use the Write tool** to save the updated list back to `ui/public/data/earnings.json`

Example workflow:
```
1. Read tool → ui/public/data/earnings.json → get existing array
2. In memory: existing_array.extend(new_stocks)
3. In memory: sort by earnings_date
4. Write tool → ui/public/data/earnings.json → save complete array
```

**Do NOT create a new file - you are updating the existing catalog!**

---

## Step 6: Update Summary

**Use the Write tool** to refresh `earnings_summary.md` with updated stats:

- Total stocks (old + new)
- Date range (expanded if needed)
- Updated sector distribution
- Refreshed weekly groupings
- New priority picks if any

---

## Step 7: Update Progress

**Use the Write tool** to update `feature_list.json` if needed. If all features were already passing, you can add:

```json
{
  "feature": "Expanded catalog with additional stocks",
  "passes": true
}
```

---

## Expansion Strategies

### If You've Covered Major Companies

Look for:
- Mid-cap tech companies (smaller but high-growth)
- Recent IPOs with upcoming earnings
- Spinoffs or newly public companies
- Companies in adjacent sectors (fintech, healthtech, edtech)

### If You Have Sector Gaps

Focus searches on underrepresented sectors:
```
"cloud infrastructure" earnings
"developer tools" companies earnings
"data infrastructure" stocks
"MLOps platforms" earnings
```

### If You Have Date Gaps

Expand timeframe if needed:
```
"tech earnings" 60-90 days ahead
"{MONTH}" technology earnings calendar
```

---

## Quality Checks

Before finishing this session:

- [ ] No duplicate tickers in earnings.json
- [ ] All new stocks meet minimum score threshold (≥75)
- [ ] Investment theses are specific (not generic)
- [ ] Fundamentals data is populated
- [ ] earnings.json is sorted by earnings_date
- [ ] earnings_summary.md reflects current totals
- [ ] Verified at least 2-3 new stocks were added

---

## Important Reminders

1. **NEVER duplicate tickers** - Always check existing catalog first
2. **APPEND, don't overwrite** - Read existing data, add to it, write back
3. **Maintain quality** - Don't add stocks just to increase count
4. **Verify earnings dates** - Dates can change, check multiple sources
5. **Keep same structure** - New stocks should match exact JSON schema
6. **Update found_date** - Use today's date for newly added stocks
7. **Cite sources** - Include research_sources URLs

---

Begin expanding your catalog now!
