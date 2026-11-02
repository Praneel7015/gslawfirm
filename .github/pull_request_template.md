<!-- PR title must be a conventional commit (feat:, fix:, docs:, chore:, ...).
     Release Please builds CHANGELOG.md and version bumps from it. -->

## Summary

<!-- What changed and why. Link the issue if there is one. -->

## How it was tested

- [ ] `pnpm qa` (typecheck, lint, BCI lint, QA scripts, production build)
- [ ] Checked the changed pages in the browser in en / te / hi, at phone width
- [ ] Lighthouse scores in the CI job summary look fine

## Checklist

- [ ] Copy follows Bar Council of India rules (no superlatives, solicitation or outcome promises)
- [ ] New strings added to messages/en.json, te.json and hi.json
- [ ] No secrets, API keys, tokens or client details in code, logs or screenshots
- [ ] `.env.example` updated for new variables
