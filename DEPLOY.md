# DEPLOY.md — instructions for the deploying agent

## What this is
A complete, production-ready STATIC website for "NBI Strategy" (nbistrategy.com).
Pure HTML/CSS/JS — NO build step, NO framework, NO server-side code, NO dependencies.

## Contents
- index.html, services.html, about.html, insights.html, contact.html
- assets/css/style.css        (all styling)
- assets/js/main.js           (animations + form handler)
- assets/img/nbi-mark-dark.png, assets/img/nbi-logo-full.png (logo artwork)

## How to deploy
Serve this folder's contents as the web root of any static host. index.html is the entry point.
All asset paths are relative — the site must be served from the domain root
(https://example.com/index.html, not https://example.com/subfolder/).

Verified options:
1. Netlify:  drag-and-drop this folder (or `netlify deploy --prod --dir .`)
2. Vercel:   `vercel --prod` from this folder (framework: none / other, no build command, output dir = .)
3. Any nginx/Apache: copy contents to the web root (e.g. /var/www/nbistrategy),
   index.html as index. Suggested nginx location block: `try_files $uri $uri/ =404;`
4. GitHub Pages / Cloudflare Pages: publish this folder as-is.

## Domain
Target domain: nbistrategy.com + www.nbistrategy.com (registered at GoDaddy).
After hosting, add the host's DNS records in GoDaddy (My Products -> nbistrategy.com -> Manage DNS).
Enable HTTPS (hosts do this automatically; on a VPS use certbot).

## Post-deploy checks
- Open / (homepage): preloader plays, hero renders, "Agent Network" diagram animates.
- Open /services.html, /about.html, /insights.html, /contact.html — all internal nav links work.
- Logo (ivory "NBI" mark) visible in header, footer, preloader on every page.
- Footer shows: Bangalore, India · +91 97414 31796 · corporate@nbistrategy.com

## Do not change
- assets/js/main.js contains LEAD_ENDPOINT — an existing n8n webhook that receives
  contact-form and newsletter submissions. Leave the URL exactly as is.
- Do not rename files or move assets; paths are referenced relatively across pages.
