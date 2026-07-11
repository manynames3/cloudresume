# Operational Context Rebalance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the standalone voice/customer-experience chapter and preserve its product-minded value as a compact, subordinate note inside the Operator Profile.

**Architecture:** Keep the homepage server-rendered and content-local. Change only the shared homepage renderer, its existing stylesheet, and rendered-HTML tests; keep Super Transcriber in the typed supporting-project data and add no component, dependency, route, image, or client JavaScript.

**Tech Stack:** React, TypeScript, Vinext, CSS, Node test runner

---

## File Map

- `tests/rendered-html.test.mjs`: Assert the removed chapter, new profile context, one supporting-project mention, in-page link, and consecutive folio labels.
- `components/home-page.tsx`: Remove the standalone section, add the operational-context note inside the profile copy, add the supporting-index anchor, and renumber folios.
- `app/globals.css`: Replace the obsolete voice-section layout rules with compact operational-context styling and remove responsive references to the deleted section.

### Task 1: Lock the narrative hierarchy with a failing rendered-HTML test

**Files:**
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Add the failing behavior test**

Add this test after the existing homepage-positioning test:

```js
test("keeps customer-workflow context subordinate to the operator profile", async () => {
  const { html } = await htmlFor("/");
  const home = visibleText(html);

  assert.doesNotMatch(html, /voice-section/);
  assert.doesNotMatch(home, /Voice & customer experience/);
  assert.match(home, /Operational context/);
  assert.match(home, /Infrastructure shaped by the workflow it serves\./);
  assert.match(
    home,
    /Direct CRM operations, webhooks, intent capture, transcript summaries, and structured handoff inform how I design integrations and failure paths\./,
  );
  assert.match(html, /href="#supporting"/);
  assert.equal((home.match(/Super Transcriber/g) ?? []).length, 1);

  for (const folio of [
    "01 / Independent cloud reference systems",
    "02 / Operator profile",
    "03 / Operating principles",
    "04 / Supporting index",
    "05 / Experience",
    "06 / Contact",
  ]) {
    assert.match(home, new RegExp(folio.replace("/", "\\/")));
  }
});
```

- [ ] **Step 2: Run the focused test file and verify RED**

Run:

```bash
npm test
```

Expected: the new test fails because `voice-section` and `Voice & customer experience` still render and the new operational-context content does not.

### Task 2: Rebalance the homepage content and styling

**Files:**
- Modify: `components/home-page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Remove the standalone chapter and add the compact profile note**

Delete the complete `voice-section` block from `components/home-page.tsx`. After the existing AWS/platform paragraph inside `profile-section__copy`, add:

```tsx
<aside className="operational-context" aria-labelledby="operational-context-title">
  <p className="subsection-label">Operational context</p>
  <h3 id="operational-context-title">
    Infrastructure shaped by the workflow it serves.
  </h3>
  <p>
    Direct CRM operations, webhooks, intent capture, transcript summaries, and
    structured handoff inform how I design integrations and failure paths. In the
    supporting systems index, that operating model appears in uploads, queues,
    completion events, usage records, and callbacks.
  </p>
  <a className="text-link" href="#supporting">
    See the supporting systems <span aria-hidden="true">↓</span>
  </a>
</aside>
```

Change the supporting section opening tag to:

```tsx
<section id="supporting" className="supporting-section" aria-labelledby="supporting-title">
```

Renumber the remaining labels to:

```text
02 / Operator profile
03 / Operating principles
04 / Supporting index
05 / Experience
06 / Contact
```

- [ ] **Step 2: Replace obsolete chapter CSS with subordinate note styling**

Remove `.voice-section` from the shared section selector, delete `.voice-section__heading` and `.voice-section__copy`, and remove their responsive grouped-selector entries.

Add:

```css
.operational-context {
  margin-top: clamp(2rem, 4vw, 3.5rem);
  padding-top: 1.4rem;
  border-top: 1px solid var(--rule);
}

.operational-context h3 {
  max-width: 24ch;
  margin-bottom: 0.9rem;
  font-size: clamp(1.55rem, 2.2vw, 2.15rem);
}

.operational-context > p:not(.subsection-label) {
  max-width: 39rem;
  margin-bottom: 1rem;
}
```

- [ ] **Step 3: Run the test suite and verify GREEN**

Run:

```bash
npm test
```

Expected: all rendered-route, claim-boundary, asset, and new narrative-hierarchy tests pass.

- [ ] **Step 4: Run static validation**

Run:

```bash
npm run lint
npm run typecheck
git diff --check
```

Expected: all commands exit `0` with no errors.

### Task 3: Inspect the responsive result and commit the implementation

**Files:**
- Verify: `components/home-page.tsx`
- Verify: `app/globals.css`
- Verify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Inspect the local production build**

Reload the existing local preview and verify at `1440×900`, `390×844`, and `320×844`:

- the standalone voice chapter is absent;
- the operational-context note stays inside the Operator Profile;
- the note is visually subordinate to the profile’s large delivery statement;
- the supporting-index link resolves to `#supporting`;
- no viewport has horizontal overflow.

- [ ] **Step 2: Commit the implementation**

```bash
git add components/home-page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "rebalance operational context"
```

- [ ] **Step 3: Attempt the existing Sites release path without replacing the project**

Use the persisted project ID in `.openai/hosting.json`. If the project is available, push the exact commit, save the matching archive, deploy it, smoke-test the public URL, and open the deployed version. If Sites still reports the persisted project as unavailable, keep the public deployment untouched and leave the validated local preview open.
