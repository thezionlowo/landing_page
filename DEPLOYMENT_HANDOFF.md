# ZAMERIA 0.2.8 login and connection hotfix

Use the `main` branch with the matching plugin and POS updates. The plugin source, coordinated release pins, and verification notes are in the [canonical plugin repository](https://github.com/avour/zameria-plugin/blob/main/LOGIN_HOTFIX_0.2.8.md).

The website must publish both `public/downloads/zameria.zip` and `public/downloads/release.json`. Deploy the complete website repository, including its account API functions. The hosted POS at `pos.zameria.co` needs its matching frontend deployment; updating a WordPress plugin does not replace hosted assets.

Existing owners missing durable store credentials must sign in once under WordPress → ZAMERIA with their existing ZAMERIA account. Staff continue signing into POS with authorized WordPress credentials. Keep the current hosted origin and browser storage to preserve device sessions and unsynced sales.

No backend source change or native application release is included in this hotfix. Actual existing-customer login after deployment remains the final production acceptance check.
