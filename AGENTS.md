# AGENTS.md

High-signal context for working in this repository.

## What This Repo Is

Personal development system containing reusable slash commands, skills, agents, and automated hooks for AI-assisted development. Works with OpenCode, Claude Code, and Cursor.

## Key Conventions

- **Slash commands**: `.md` files in `slash-commands/` with YAML frontmatter
- **Skills**: `.md` files in `skills/` with YAML frontmatter
- **Agents**: `.md` files in `agents/` with YAML frontmatter
- **Hooks**: Executable `.sh` scripts in `hooks/` (NOT markdown)

## Hooks

| Hook | Runs |
|------|------|
| `pre-commit` | lint → typecheck → test → build |
| `pre-push` | security → pre-commit |
| `security` | Secrets detection only |

Run manually: `./hooks/pre-commit`, `./hooks/pre-push`, `./hooks/security`

Skip: `git commit --no-verify`, `git push --no-verify` (not recommended)

## Commands with `--prd` Flag

All init commands support `--prd` to create PRD → Plan → Scaffold:
- `/init-api`
- `/init-frontend`
- `/init-python`
- `/init-rails`

## Special Behaviors

- **agent-code**: Automatically calls `agent-tdd` with user notification before proceeding
- **frontend-design skill**: Uses 47 company design systems from `https://github.com/olaishola05/awesome-design-md`
- **fix.md**: Auto-applies fixes, verifies with tests, rollback on failure
- **clean.md**: Removes logs/comments (no test verification)
- **pr-summary.md**: Includes implementation plan from `./plans/`

## Stack Detection

Init commands auto-detect framework from lockfiles:
- NestJS/Express/Fastify: `package.json`
- Go: `go.mod`
- FastAPI/Django: `requirements.txt` or `pyproject.toml`

## Reference

- Main docs: `README.md`
- Hooks: `hooks/README.md`
- Slash commands: `slash-commands/README.md`
- Skills: `skills/README.md`
- Agents: `agents/README.md`