[Leia em português](PULL_REQUEST_TEMPLATE.pt-BR.md)

## Summary

Describe clearly what changed.

## Motivation

Why is this change needed?

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation update
- [ ] Data update
- [ ] Other (describe below)

## Main files changed

List the key files touched in this PR.

## Validation steps executed

Describe exactly what you tested.

Example:

1. Started local static server at repository root.
2. Opened /, /pt/, and /en/.
3. Tested Book/Chapter/Verse selection in PT and EN.
4. Checked mobile layout around 360px width.
5. Checked browser Console and Network.

## Required pre-PR checklist

### Site stability

- [ ] Site loads locally without blank screens.
- [ ] Routes /, /pt/, and /en/ load correctly.
- [ ] Quick-nav links point to valid sections.

### Functional behavior

- [ ] Book/Chapter/Verse flow works in PT.
- [ ] Book/Chapter/Verse flow works in EN.
- [ ] Content updates correctly when reference changes.

### Visual regression

- [ ] Desktop layout checked (for example, 1366px+).
- [ ] Mobile layout checked (around 360px width).
- [ ] "Select reference" block remains usable on mobile.
- [ ] Literal translation and word-by-word sections remain readable.

### Console and network

- [ ] No Console errors related to this change.
- [ ] No new 404 errors for JSON, CSS, or JS.

### Data quality (if data/ changed)

- [ ] Modified JSON files are syntactically valid.
- [ ] IDs for book/chapter/verse/token remain stable when possible.
- [ ] No unintended schema changes.

### Cross-language consistency

- [ ] PT and EN behavior remain equivalent for changed UI flows.
- [ ] Labels/anchors/text are consistent where applicable.

### Licenses and sources (if textual content changed)

- [ ] Source licensing was checked.
- [ ] Changes are compliant with LICENSE-DATA and SOURCES-LICENSES.md.

## Screenshots or evidence

Add screenshots, logs, or short notes proving the checks above.

## Risks and rollback plan

Describe known risks and how to revert safely if needed.

## Additional notes

Include anything reviewers should pay special attention to.
