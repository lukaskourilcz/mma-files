---
name: commit-discipline
description: Commit and push conventions for the mma-files repository. Use at the START of every session in this repo, before making any edits, and again when the session is wrapping up. Covers when to commit, how to phrase messages, and how to publish a verified session branch.
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
feat(content): add Czech fight-week articles
fix(routes): preserve the current section in navigation
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

Day-to-day work happens on a short-lived session branch created from an
up-to-date `main`. Use the repository's requested branch when one is supplied;
otherwise prefix it with `claude/`. Do not commit directly to `main`.

Before the first edit in a new session:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b claude/<short-task-name>
```

## 5. End of session — publish the session branch

When the session's work is finished and verified, publish it:

```bash
npm run typecheck && npm run build
```

Only if that passes, push the current session branch:

```bash
git push -u origin HEAD
```

Open or update the repository's normal review path. Merge into `main` only when
the task explicitly authorizes it and every required check is green. If `main`
moved, do **not** force-push: integrate the new commits into the session branch,
re-run the checks, and push normally.

Report the pushed commit range to the user. If the build fails, do not publish
an unverified merge; fix it or report exactly what remains broken.

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
