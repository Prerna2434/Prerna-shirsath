# Rules

This file defines the coding standards, conventions, and guidelines that all contributors must follow.

---

## General Principles

- Write clear, self-documenting code.
- Prefer readability over cleverness.
- Keep functions small and focused on a single responsibility.
- Avoid premature optimization.

---

## Naming Conventions

- **Variables & Functions**: `camelCase`
- **Classes & Types**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `kebab-case` (e.g., `user-profile.js`)

---

## Code Style

- Use 2-space indentation (or as configured in `.editorconfig`).
- Always add a newline at the end of a file.
- Remove unused imports and variables before committing.
- Limit line length to **100 characters**.

---

## Git Workflow

- Branch naming: `feature/`, `fix/`, `chore/`, `docs/` prefixes.
- Write meaningful commit messages (imperative mood: *"Add feature"*, not *"Added feature"*).
- Never commit directly to `main` or `master`; use pull requests.
- Squash commits before merging when appropriate.

---

## Documentation

- Every public function/class must have a doc comment.
- Update `changelog.md` for every user-facing change.
- Document decisions in `decisions.md`.

---

## Testing

- Write tests for all new features and bug fixes.
- Aim for meaningful coverage, not just high percentages.
- Tests must pass before a PR can be merged.

---

<!-- Add or update rules as the project evolves -->
