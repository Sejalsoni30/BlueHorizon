# Data Sources & License Register — BlueHorizon

| Source Name | Ingestion Route | License | Attribution Requirement | Update Cadence | Operational Latency | Status in BlueHorizon |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Open-Meteo** | REST API (`api.open-meteo.com`) | CC BY 4.0 | "Weather data by Open-Meteo.com" | Hourly | < 1 hour | **Connected & Live** |
| **NASA Earthdata / GPM IMERG** | HTTPS / OpenDAP / S3 | Public Domain / Open Data | "NASA Global Precipitation Measurement (GPM) IMERG" | 30 mins | ~4 hrs (Early), ~14 hrs (Late) | **Adapter + Live / Fallback Mock** |
| **CWC / India-WRIS** | Open Web-GIS (`indiawris.gov.in`) | Govt Open Data License (NDSAP) | "Central Water Commission (CWC), Ministry of Jal Shakti" | Daily / 12-hourly | 2–6 hours | **Adapter + Demo Cache** |
| **NDMA SACHET / CAP** | XML RSS / CAP standard | Govt Open Data License (NDSAP) | "National Disaster Management Authority (NDMA)" | Event-driven | 15–45 mins | **Adapter + CAP Ingestion** |
| **Copernicus Sentinel (S1/S2)** | Copernicus Data Space Ecosystem | Open Access License | "Contains modified Copernicus Sentinel data [Year]" | 5–12 days revisit | 1–3 hrs (NRT) | **SAR Mask Adapter** |
| **OpenStreetMap** | Overpass API / Tile Server | ODbL 1.0 | "© OpenStreetMap contributors" | Real-time edits | Sub-second | **Connected via Leaflet** |

*Notice*: Any synthetic or historical test data used in development is tagged with `isDemo: true` and rendered with a visible "Demo data" pill.

