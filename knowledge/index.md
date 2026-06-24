---
type: index
title: "chathub-browser-ext personal fork — usePremium always-on"
description: "GPL-3.0 fork of chathub-dev/chathub. Single divergence: src/app/hooks/use-premium.ts unconditionally returns activated=true. Personal-use only — NOT for Chrome Web Store distribution. Install via 'Load unpacked' in chrome://extensions. Original upstream sells premium subscriptions; out of fairness this fork is not redistributed."
tags: [fork, chathub, browser-extension, gpl-3.0, personal-use]
timestamp: 2026-06-24
format_version: okf-v0.1
status: active
related:
  - rules/fork-discipline
  - decisions/policy/forked-extension-cws-rules
---

# chathub-browser-ext (personal fork)

## Why

For personal use of premium UI features (web access toggle, full history search, etc.) on a self-hosted local install. The fork is GPL-3.0 — modification + redistribution are legal — but the upstream `chathub-dev` team funds development via premium subscriptions, so this fork is deliberately **personal-use only**, not redistributed via Chrome Web Store.

## Divergence

Single file changed: `src/app/hooks/use-premium.ts`. A new `ALWAYS_PREMIUM = true` constant short-circuits the SWR validator and the returned `activated` flag. Every premium-gated UI element (`WebAccessCheckbox`, `History/Dialog`, `Premium/*`) reads this hook, so the one-line patch covers them all.

Comments marked with `chathub-plus-fork:` so `git grep chathub-plus-fork` locates the divergence during rebase.

## Caveats

The premium gates are UI-layer only. Features that talk to upstream's API for crowdsourced data (if any) still respect their own auth. Features that talk to LLM providers (GPT-4, Claude, Midjourney, etc.) still need YOUR OWN API keys configured in settings — premium activation does not provide model access.

## Install

```
cd repos/c127/frk/prod/bs-ext/chathub-browser-ext
yarn install
yarn build
# Then in chrome://extensions: enable Developer mode, "Load unpacked",
# point at the dist/ folder.
```

## Rebase

```
cd repos/c127/frk/prod/bs-ext/chathub-browser-ext
git remote add upstream https://github.com/chathub-dev/chathub.git
git fetch upstream
git rebase upstream/main
```

Single-file divergence keeps rebase trivial. Conflict only triggers if upstream renames or removes `usePremium()` or significantly refactors `validatePremium()` — in which case re-port the `ALWAYS_PREMIUM` short-circuit to whatever the new hook looks like.
