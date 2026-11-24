# Above the Fog · St. Gallen

A web guide for escaping valley fog (*Hochnebel*) around **St. Gallen, Switzerland**, with live MeteoSwiss & Open-Meteo inversion detection.

## What's Inside
- **Live Weather Auto-Fill (`/api/weather`):** Serverless Vercel Function that fetches MeteoSwiss 10-minute station measurements (`STG` St. Gallen 776 m, `HOE` Hörnli 1,133 m, `SAE` Säntis 2,502 m, `ALT` Altenrhein 398 m) plus Open-Meteo cloud/sunshine forecasts (cached for 10 minutes), automatically setting the estimated fog ceiling and wind profile on load.
- **Interactive Spot Finder:** Adjust the forecast fog ceiling (`700–2,000 m`), wind condition (calm, weak/strong Bise, SW/Föhn), transport mode (GA/public transit vs. car), and seasonal cable car closure visibility.
- **11 Curated Escapes (1,064 m – 2,502 m):** Pfänder, Vögelinsegg, St. Anton, Oberer Gäbris, Hochhamm, Hundwiler Höhi, Schwägalp, Ebenalp, Kronberg, Hoher Kasten, and Säntis.
- **Verified Live Webcams & Fog Tools:** Direct links to Panomax, Roundshot 360° cams, Kronberg + Jakobsbad dual cams, `suncatcher.ch`, `nebelkarte.ch`, MeteoSwiss, and SRF Meteo.
- **Decision Playbook:** Night-before and breakfast verification checklist using MeteoSwiss text forecasts, sunshine sensors (St. Gallen vs. Säntis), and temperature inversion checks.

## Preview Locally
Run the Vercel dev server (if Vercel CLI is installed) to run `/api/weather` locally:
```bash
vercel dev
```
Or preview the static frontend (automatically falls back to Open-Meteo in the browser):
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Publish Publicly
Push to `main` on GitHub—Vercel automatically deploys both the static frontend and the `/api/weather` serverless endpoint.
