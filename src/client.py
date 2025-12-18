"""
Claude Agent SDK Client Configuration
=====================================

Configured client using Claude Code CLI (uses your existing authentication).
"""

import json
from pathlib import Path

from claude_agent_sdk import query, ClaudeAgentOptions

# System prompt for the earnings research agent
SYSTEM_PROMPT = """You are an expert investment research analyst specializing in technology stocks.

Your capabilities:
- Read, write, and edit files
- Execute bash commands (within allowed list)
- Search the web for earnings dates, stock data, and company research
- Analyze fundamentals, growth signals, and competitive positioning
- Score stocks based on long-term investment potential
- Draft investment theses and identify catalysts/risks

Investment Focus:
- Long-term growth investing (3-12 month holds)
- Technology sector (AI/ML, Cloud/SaaS, AWS ecosystem)
- Fundamental analysis over momentum trading
- Focus on moats, margins, and sustainable growth

Research Guidelines:
1. Always read existing earnings.json before adding new stocks
2. Verify earnings dates from multiple sources
3. Score based on fundamentals (revenue growth, margins, ROIC, moat strength)
4. Draft concise investment theses (2-3 sentences)
5. Identify specific catalysts and risks
6. Never duplicate tickers in the catalog
7. Use public data sources only (Yahoo Finance, Nasdaq, Earnings Whispers, SEC EDGAR)
8. Maintain professional, objective analysis

Scoring Criteria (0-100):
- Fundamentals (60 pts): Revenue growth, margins, FCF, ROIC, debt, moat
- Growth Durability (25 pts): TAM expansion, competitive position, differentiation
- Valuation (10 pts): PEG ratio, growth justifies premium
- Sentiment (5 pts): Analyst consensus, insider activity
"""


def create_client_options(project_dir: Path, model: str) -> ClaudeAgentOptions:
    """
    Create configured Claude Agent options.

    Uses your existing Claude Code CLI authentication - no API key needed.

    Args:
        project_dir: Working directory for the agent
        model: Claude model to use

    Returns:
        Configured ClaudeAgentOptions
    """
    # Write settings file
    settings = {
        "permissions": {
            "allow": ["./**"],
            "deny": ["../**", "~/**"],
        },
    }
    settings_path = project_dir / ".claude_settings.json"
    with open(settings_path, "w") as f:
        json.dump(settings, f, indent=2)

    # Create options - uses CLI authentication, fully autonomous
    return ClaudeAgentOptions(
        system_prompt=SYSTEM_PROMPT,
        max_turns=100,
        cwd=str(project_dir),
        allowed_tools=["Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebSearch", "WebFetch", "TodoWrite"],
        permission_mode="acceptEdits",  # Auto-accept without prompting
    )


async def run_query(prompt: str, options: ClaudeAgentOptions):
    """
    Run a query using Claude Code CLI authentication.

    Args:
        prompt: The prompt to send
        options: Configured options

    Yields:
        Events from the Claude response
    """
    async for message in query(prompt=prompt, options=options):
        yield message
