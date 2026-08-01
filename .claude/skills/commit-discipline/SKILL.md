---
name: commit-discipline
description: Commit and push conventions for the mma-files repository. Use at the START of every session in this repo, before making any edits, and again when the session is wrapping up. Covers when to commit, how to phrase messages, and the end-of-session push to main.
---

# Commit discipline — mma-files

This repository is worked on almost entirely by agent sessions. Long uncommitted
stretches lose work and make review impossible. Follow these rules in **every**
session, including short ones.

## 1. Commit frequently

Commit after every self-contained unit of work. Do not wait until the end of the
session and do not wait to be asked.

Commit when you have just:

- scaffolded the project or added dependencies;
- added or changed the content model / types;
- added or changed seed content (articles, fighters, events);
- finished a component or a group of related components;
- finished a route or a group of related routes;
- fixed a build, type, or lint failure;
- updated documentation.

Rough target: **a commit every 10–20 minutes of work, or every 3–8 files
touched**, whichever comes first. A session that produces one large commit is a
failed session.

Never bundle unrelated changes into one commit. If you touched two unrelated
areas, make two commits.

## 2. Commit working code

Before each commit, the repo should build or at least typecheck:

```bash
npm run typecheck
```

If a commit is deliberately intermediate and does not yet compile, say so in the
message body (`WIP: …`) so a reviewer is not surprised. Prefer not to — reorder
the work so each commit is coherent instead.

## 3. Message format

Use Conventional Commits. Subject in the imperative, lower case after the type,
no trailing period, under ~72 characters.

```
feat(content): add bilingual seed articles for fight-week format
fix(i18n): preserve current route when switching locale
chore(deps): pin next to 15.5.22
docs(readme): explain how to replace demo data with a CMS
style(homepage): tighten hero lead spacing on mobile
refactor(repository): move article filtering behind the repo abstraction
```

Types in use: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Add a short body when the *why* is not obvious from the subject. Skip the body
for mechanical changes.

Sign agent commits:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## 4. Branching

Day-to-day work happens on `dev`. Do not commit directly to `main` mid-session.

If `dev` does not exist, create it from `main` before the first edit:

```bash
git checkout -b dev
```

## 5. End of session — push to main

When the session's work is finished and verified, publish it:

```bash
npm run typecheck && npm run build
```

Only if that passes:

```bash
git checkout main
git merge --ff-only dev
git push origin main
git checkout dev
git push origin dev
```

If `main` does not exist yet (fresh repository), create it from `dev`:

```bash
git branch -M dev main && git push -u origin main
```

If the fast-forward merge is rejected because `main` moved, do **not** force
push. Rebase `dev` onto `main`, re-run the build, and try again.

Report the pushed commit range to the user. If the build fails, do not push —
fix it, or tell the user exactly what is broken and leave the work committed on
`dev`.

## 6. What not to commit

- `node_modules/`, `.next/`, `.env*.local`, `*.tsbuildinfo` — already in
  `.gitignore`; do not override it with `git add -f`.
- Credentials, API keys, tokens, or private BoardlessAI owner notes.
- Real fighter photography or promotion artwork without cleared rights.
- Unpublished drafts or internal editorial reasoning from the private newsroom.

## 7. Interactive git is unavailable

`git rebase -i`, `git add -i`, and anything that opens an editor will hang. Use
non-interactive equivalents (`git rebase --onto`, `git commit -m`,
`GIT_EDITOR=true git …`).
