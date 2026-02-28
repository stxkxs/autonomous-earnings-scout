#!/usr/bin/env bash
# Start both the Python agent and the Next.js dashboard
set -e

trap 'kill 0' EXIT

echo "Starting Earnings Scout..."
echo ""

# Start the Next.js dev server
echo "[UI] Starting dashboard on http://localhost:3000"
(cd ui && npm run dev) &

# Start the Python agent
echo "[Agent] Starting earnings scout agent"
uv run earnings-scout &

wait
