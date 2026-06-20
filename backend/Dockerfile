# TS Assistant backend — FastAPI/uvicorn on :8008, dependencies managed with uv.
# Built from the official uv image so the lockfile is honored exactly.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# Install into a project-local .venv and put it on PATH. UV_LINK_MODE=copy avoids
# hardlink warnings across the image's filesystem layers.
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/app/backend/.venv \
    PATH="/app/backend/.venv/bin:$PATH"

WORKDIR /app/backend

# Dependency layer first — re-runs only when the lockfile changes, not on code edits.
# `package = false` in pyproject means there's no project to install, just deps.
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Application code.
COPY app ./app

# config.py derives REPO_ROOT as the parent of /app/backend, so at runtime
# /app/data (persisted) and /app/sample_database (the user's DB, bind-mounted)
# are the data + source-DB directories. See docker-compose.yml.
EXPOSE 8008
# Bind 0.0.0.0 so the published port is reachable from the LAN.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8008"]
