# Above the Fog · St. Gallen

A static, publish-ready web guide for escaping valley fog (*Hochnebel*) around **St. Gallen, Switzerland**.

## What's Inside
- **Interactive Spot Finder:** Adjust the forecast fog ceiling (`700–2,000 m`), wind condition (calm, weak/strong Bise, SW/Föhn), transport mode (GA/public transit vs. car), and Nov 2026 cable car closure visibility.
- **11 Curated Escapes (1,064 m – 2,502 m):** Pfänder, Vögelinsegg, St. Anton, Oberer Gäbris, Hochhamm, Hundwiler Höhi, Schwägalp, Ebenalp, Kronberg, Hoher Kasten, and Säntis.
- **Live Webcams & Fog Tools:** Direct links to the Kronberg + Jakobsbad dual-webcam check, Roundshot 360° cams, `suncatcher.ch`, `nebelkarte.ch`, MeteoSwiss, and SRF Meteo.
- **Decision Playbook:** Night-before and breakfast verification checklist using MeteoSwiss text forecasts, sunshine sensors (St. Gallen vs. Säntis), and temperature inversion checks.

## Preview Locally
Run a simple static server from this folder:
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Publish Publicly
Because this site is pure HTML, CSS, and vanilla JS with no build step, you can deploy the folder directly to any static host:
- **Vercel:** `npx vercel --prod` (or drag-and-drop / connect repo)
- **Netlify Drop:** Drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
- **Cloudflare Pages / GitHub Pages:** Push the files to a repository and serve the root directory.
