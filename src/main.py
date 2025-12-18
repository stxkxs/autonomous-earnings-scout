#!/usr/bin/env python3
"""
Autonomous Tech Earnings Scout
================================

Autonomous agent that discovers tech company earnings, researches fundamentals,
and scores long-term investment opportunities.

Usage:
    python -m src.main --project-dir ./output
    python -m src.main --sectors ai_ml cloud_saas --max-iterations 10
"""

import argparse
import asyncio
from pathlib import Path

from .agent import run_autonomous_agent

DEFAULT_MODEL = "claude-sonnet-4-5-20250514"
DEFAULT_MAX_ITERATIONS = 20
DEFAULT_DAYS_AHEAD = 60
DEFAULT_MIN_SCORE = 75


def parse_args() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Autonomous agent that researches tech earnings and scores investment opportunities.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Default: all preferred sectors, next 60 days
  python -m src.main

  # Focus on AI + large-cap only
  python -m src.main --sectors ai_ml --market-cap large mega

  # High-conviction picks only
  python -m src.main --min-score 85

  # Specific timeframe
  python -m src.main --days-ahead 30

Environment:
  Uses Claude Code CLI authentication (no API key needed)
        """,
    )

    parser.add_argument(
        "--project-dir",
        type=Path,
        default=Path("./output"),
        help="Directory for earnings catalog output (default: ./output)",
    )

    parser.add_argument(
        "--max-iterations",
        type=int,
        default=DEFAULT_MAX_ITERATIONS,
        help=f"Maximum agent iterations (default: {DEFAULT_MAX_ITERATIONS})",
    )

    parser.add_argument(
        "--model",
        type=str,
        default=DEFAULT_MODEL,
        help=f"Claude model to use (default: {DEFAULT_MODEL})",
    )

    parser.add_argument(
        "--sectors",
        type=str,
        nargs="+",
        choices=["ai_ml", "cloud_saas", "aws_ecosystem", "semiconductors", "cybersecurity", "fintech", "all"],
        default=["ai_ml", "cloud_saas", "aws_ecosystem"],
        help="Tech sectors to focus on (default: ai_ml cloud_saas aws_ecosystem)",
    )

    parser.add_argument(
        "--market-cap",
        type=str,
        nargs="+",
        choices=["small", "mid", "large", "mega", "all"],
        default=["all"],
        help="Market cap filter: small (<$2B), mid ($2-10B), large ($10-200B), mega (>$200B)",
    )

    parser.add_argument(
        "--days-ahead",
        type=int,
        default=DEFAULT_DAYS_AHEAD,
        help=f"Look for earnings dates within next N days (default: {DEFAULT_DAYS_AHEAD})",
    )

    parser.add_argument(
        "--min-score",
        type=int,
        default=DEFAULT_MIN_SCORE,
        help=f"Minimum investment score to include 0-100 (default: {DEFAULT_MIN_SCORE})",
    )

    return parser.parse_args()


def main() -> None:
    """Main entry point."""
    args = parse_args()

    # Uses your existing Claude Code CLI authentication - no API key needed!
    print("Autonomous Tech Earnings Scout")
    print("=" * 50)
    print("Using Claude Code CLI authentication...")

    try:
        asyncio.run(
            run_autonomous_agent(
                project_dir=args.project_dir,
                model=args.model,
                max_iterations=args.max_iterations,
                sectors=args.sectors,
                market_cap=args.market_cap,
                days_ahead=args.days_ahead,
                min_score=args.min_score,
            )
        )
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
        print("To resume, run the same command again")
    except Exception as e:
        print(f"\nFatal error: {e}")
        raise


if __name__ == "__main__":
    main()
