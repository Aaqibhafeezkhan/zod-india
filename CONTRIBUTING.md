# Contributing

Thanks for helping. This project aims to be small, correct and well-sourced.

## Setup

Requires Node 20+ for development (the published package supports Node 18+).

```sh
npm install
npm test             # vitest, zod v4
npm run test:zod3    # schema tests against zod v3
npm run test:coverage
npm run lint && npm run typecheck && npm run build
```

## Rules

1. **Cite a source.** A change to a format rule needs a link to official documentation (GSTN, CBIC, Income Tax Department, RBI, NPCI, UIDAI, MoRTH) in the PR.
2. **No real personal data.** Use synthetic values (generate check digits with `gstinCheckChar` / `verhoeffGenerate`) or the generic samples already used in public docs.
3. **Keep coverage at 100%** and add valid and invalid cases for every rule change.
4. **No runtime dependencies.** Zod is the only peer dependency.
5. **Add a changeset** (`npx changeset`) for any user-facing change. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
