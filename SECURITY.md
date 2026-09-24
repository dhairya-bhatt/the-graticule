# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

---

## Prototype Notice: Client-Side Admin Storage

**The Graticule** currently operates as a static-first prototype. The administrative dashboard (`/admin/`) utilizes browser `sessionStorage` and `localStorage` to allow in-browser article editing, author management, and JSON database export without requiring an external database server out of the box.

> [!WARNING]
> While default prototype credentials (`admin` / `graticule2021`) can be customized through the dashboard, client-side authentication is meant for demonstration and preview environments. When deploying to a high-traffic production publication with restricted editorial access, it is strongly recommended to connect the store functions (`src/data/store.ts`) to an authenticated backend API (e.g., Supabase, Cloudflare Workers KV, AWS Lambda, or Firebase Auth).

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within this repository, please do **not** open a public issue.

Instead, please report it privately:
1. Contact the maintainers via email at: `editorial@thegraticule.org` (or directly via GitHub Security Advisories).
2. Include a detailed description of the vulnerability, reproduction steps, and potential impact.
3. We will acknowledge receipt within 48 hours and work with you on a resolution prior to public disclosure.
