# ZAMERIA 0.2.6 coordinated release

Use this repository's `release/zameria-0.2.6` branch together with the matching backend, plugin, website, POS and admin repositories. Production branches have not been changed by this handoff.

The complete deployment order, pinned source manifest, QA report and workspace assembly script are in:

[ZAMERIA deployment handoff](https://github.com/avour/zameria-plugin/blob/release/zameria-0.2.6/DEPLOYMENT_HANDOFF.md).

Deploy the backend first. Plugin 0.2.6 needs its new account/store credential endpoints. Preserve existing cloud environment, secrets and service configuration. After the coordinated rollout, existing owners sign in/reconnect once in WordPress; each POS device must open the updated application for its local duplicate-cache repair.

Native assets are rebuilt from the POS repository using `npm run sync` in the assembled mobile checkout. Signing, native/device acceptance and app-store publication remain separate steps. No secrets are supplied by this repository; configure them in the existing deployment environment.
