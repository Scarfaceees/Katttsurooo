---
name: ponytail
description: Review the current diff or a given branch, PR, or path for correctness bugs and report verified findings in a fixed format. Use when the user asks to review changes, check a diff, or run "ponytail" on pending work.
---

# Ponytail: code review helper

Review the code the user points at and report only findings you can back up.

## 1. Pick the target

- No argument: review the working-tree diff against `HEAD`, plus staged changes.
- A branch name: review `git diff <base>...<branch>`, where `<base>` is the default branch.
- A path: review the files under that path.

Run `git status` and `git diff` first. Read each changed file in full when the hunk alone is not enough to judge it.

## 2. Look for correctness problems

Focus on:

- Logic errors, off-by-one errors, and wrong conditions.
- Unhandled errors, missing `null` or `undefined` checks, and unchecked return values.
- Race conditions and state that is shared or mutated unexpectedly.
- Resource leaks: files, connections, timers, listeners.
- Security issues: unsanitized input, secrets in code, unsafe shell or SQL construction.
- Behavior changes the author did not mention.

Skip style, naming, and formatting unless they hide a bug.

## 3. Verify each finding

For every candidate, trace a concrete input or state that triggers it. Name the file and line. Drop anything you cannot trace. Do not report speculation as a defect.

## 4. Report

List verified findings, most severe first, in this format:

```
[severity] path/to/file:line — one-sentence defect
  Trigger: the input or state that causes it
  Fix: the smallest change that resolves it
```

Severity is `high` (crash, data loss, or security), `medium` (wrong result in a plausible case), or `low` (wrong result in an edge case).

If nothing survives verification, say "No verified issues found in <target>." Do not invent findings to fill the list.

## Constraints

- Do not edit files unless the user asks for fixes.
- Do not post comments to GitHub unless the user asks.
