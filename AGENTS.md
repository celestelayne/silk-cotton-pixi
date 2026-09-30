# Folklore Storytelling Experiment — Agent Instructions

This project is a generative, stateful collage. The browser is the scene graph.

## Folder Structure

```text
src/
├── world/      world.ts, coordinates.ts, generate.ts, assets.ts
├── behaviors/  drift, spiral, gather, disperse
├── effects/    filters, ripple
├── sound/      sound.ts
├── memory/     memory.ts
├── text/       fragments.ts
├── App.tsx
└─ styles.css

public/
├── images/
└── sound/

```

## Validation

Before saying work is complete, run the narrowest relevant validation first.

Expected commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If any script does not exist, report that fact. Do not silently add a new tool or dependency in order to make it exist.

## Working with the user

- Inspect relevant files before proposing changes.
- For any change affecting more than 3 files or project configuration, provide a concise plan before editing.
- If a requirement is ambiguous, ask a focused question rather than choosing an architecture or product behavior.
- Make the smallest valid change that meets the stated acceptance criteria.
- Do not expand a task with "while I am here" refactors.

## Completion report

After every implementation task, report:

1. Files changed
2. What changed in each file
3. Files intentionally not changed
4. Validation commands run and their results
5. Assumptions, limitations, or blocked follow-up work