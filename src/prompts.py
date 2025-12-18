"""
Prompt Loading Utilities
========================

Load prompt templates from the prompts directory.
"""

from pathlib import Path

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def load_prompt(name: str) -> str:
    """Load a prompt template by name."""
    prompt_file = PROMPTS_DIR / f"{name}.md"
    if not prompt_file.exists():
        raise FileNotFoundError(f"Prompt not found: {prompt_file}")
    return prompt_file.read_text()


def get_initializer_prompt() -> str:
    """Load the initializer prompt for first session."""
    return load_prompt("initializer_prompt")


def get_coding_prompt() -> str:
    """Load the continuation prompt for subsequent sessions."""
    return load_prompt("continuation_prompt")


def copy_profile_to_project(
    project_dir: Path,
    sectors: list[str],
    market_cap: list[str],
    days_ahead: int,
    min_score: int,
) -> None:
    """Copy and customize the investment profile to the project directory."""
    profile_file = PROMPTS_DIR / "investment_profile.txt"
    if profile_file.exists():
        dest = project_dir / "investment_profile.txt"
        if not dest.exists():
            # Read template and customize
            content = profile_file.read_text()
            content = content.replace("{{SECTORS}}", ", ".join(sectors))
            content = content.replace("{{MARKET_CAP}}", ", ".join(market_cap))
            content = content.replace("{{DAYS_AHEAD}}", str(days_ahead))
            content = content.replace("{{MIN_SCORE}}", str(min_score))
            dest.write_text(content)
            print(f"Created investment_profile.txt at {dest}")
