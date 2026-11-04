# BLUEHORIZON — Flood & Drought Warning Intelligence Layer

> **Tagline**: *"See the Risk. Prepare Before It Happens."*  
> **Positioning**: A complementary flood and drought intelligence layer that improves interpretation, trust, localization, and preparedness. **It does NOT replace IMD, CWC, NDMA, or State Disaster Management Authority warnings, and it never issues official alerts.**

---

## 1. System Overview & The 5 Core MVP Innovations

BlueHorizon sits downstream of official hydrometeorological data providers and upstream of community action, directly addressing the workflow gaps identified in national disaster alerting frameworks:

1. **Confidence-Aware Risk Communication**: Replaces deterministic "Danger" declarations with calibrated probabilities and distribution-free conformal quantile intervals ($\pm 0.2\text{m}$ to $\pm 0.45\text{m}$).
2. **Environmental Data Reliability Monitor**: Automatically tracks telemetry latency, stuck sensor decimals, and satellite-gauge divergences, explicitly degrading confidence when station feeds fail.
3. **Hyperlocal Causal Narratives**: Translates complex multivariate feature weights (TreeSHAP) into plain-language explanations of why a flood or drought is intensifying.
4. **Combined Flood + Drought Intelligence**: Unifies slow-onset agricultural drought desiccation and rapid-onset pluvial/riverine flooding onto a single geospatial canvas to track compound hydro-climatic whiplash.
5. **Personalised Household Preparedness Engine**: Converts abstract hazard percentages into actionable, time-sequenced family checklists tailored to dwelling floor level, elderly/infants care, and livestock assets.

---

## 2. Monorepo Architecture

```
/BlueHorizon
├── /client           # React 18 + TypeScript + Vite + Tailwind CSS + Three.js / R3F + Leaflet + Recharts
├── /server           # Node.js + Express (TypeScript) + MongoDB (Mongoose) + JWT Auth + Rate Limiting
├── /ml               # Python + FastAPI + Scikit-learn + Pandas (Dual Pipeline & Uncertainty)
├── /docs             # Scientific & Governance Documentation
│   ├── data-sources.md   # Open Data & Licensing Register (Open-Meteo, NASA GPM, CWC, OSM)
│   ├── model-card.md     # Scikit-learn Model Architecture, Baselines & Metrics
│   ├── evaluation.md     # Benchmark evaluation against persistence & climatology baselines
│   └── limitations.md    # Known limitations, unmodeled physical factors, and privacy notes
└── /scripts          # Seed scripts and deployment automation
```

---

## 3. Quickstart & Installation

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: 3.10+ (tested on Python 3.12)
- **MongoDB**: (Optional local instance on `localhost:27017`; backend includes memory/mock fallback for standalone preview)

### Step 1: Install Dependencies
```bash
# Install root, client, and server dependencies
npm install
npm --prefix client install
npm --prefix server install

# Install Python ML dependencies
pip install -r ml/requirements.txt
```

### Step 2: Start All Services

**Terminal 1 — Python ML Intelligence Service**:
```bash
cd ml
uvicorn main:app --port 8000 --reload
```

**Terminal 2 — Node.js Express Backend API**:
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 3 — Client Frontend**:
```bash
cd client
npm run dev
# Open http://localhost:5173 in browser
```

---

## 4. Automated Testing

Every tier of BlueHorizon includes automated test coverage:

```bash
# Test Server API Routes (Vitest + Supertest)
npm --prefix server test

# Test Python ML Intelligence Service (pytest)
python -m pytest ml/test_ml_service.py

# Test Client Production Build (Vite + TypeScript)
npm --prefix client run build
```

---

## 5. Walkthrough Demo Script (5-Minute Evaluation)

1. **The Horizon Line & 3D Hero (`/`)**:
   - Observe the 0→100% Loader Ring fold into the BlueHorizon logo (session-cached; skippable).
   - Scroll through the landing page to watch the luminous cyan waterline path trace the full document height.
   - Interact with the mouse-parallax tilting glass risk card displaying calibrated 78% probability with confidence bounds.
   - Click the central logo portal at mid-page to expand the **Dual-Hazard Plate** comparing flood surge vs. agricultural drought.
   - Adjust the **Interactive What-If Teaser** sliders (rainfall and soil saturation) to watch real-time simulated terrain runoff depths.

2. **Role-Based Authentication (`/auth`)**:
   - Toggle between Sign In and Register.
   - Test password strength meter (enforces 8+ characters, uppercase, and numbers).
   - Use the **Quick Evaluation Credentials** to instantly sign in as a Citizen, Volunteer Responder, or Administrator.

3. **Intelligence Dashboard (`/dashboard`)**:
   - Switch between catchments (Pune Mula-Mutha, Nashik Godavari, Cuttack Mahanadi, Raichur Tungabhadra).
   - Inspect the **Data Freshness Strip** displaying live latency and data quality scores.
   - Review the **Flood Risk Card** (probability, conformal interval $\pm 0.3\text{m}$, river stage bar, and TreeSHAP driver weights).
   - Review the **Drought Risk Card** (SPEI-3 index with methodology accordion and soil deficit percentage).
   - Explore the **Recharts Hydrograph** and click **Table Alt** to verify the accessible screen-reader view.
   - Interact with the **Leaflet Geospatial Canvas** to toggle flood, drought, and crowdsourced pins.

4. **Household Emergency Preparedness (`/preparedness`)**:
   - Customize family parameters (infants, elderly members, dwelling floor level, livestock).
   - Notice how the checklist dynamically adapts (e.g. ground floor adds vertical evacuation and asset elevation; livestock adds herd safety; infants adds formula and ORS buffers).
   - Click **Print / Save Checklist** to test the clean printable format.

5. **Hypothetical What-If Simulator (`/simulator`)**:
   - Read the prominent amber safety banner: *"Hypothetical scenario — not a forecast"*.
   - Adjust rainfall downpour ($0-250\text{mm}$), soil moisture ($0-100\%$), and dam spillway releases to inspect hydrodynamic crest arrival times and overland ingress footprints.

6. **Community Ground Verification Feed (`/community`)**:
   - Click **Use My GPS** to lock live device coordinates.
   - Submit an observation (e.g. water overtopping causeway).
   - Filter by status (`all`, `verified`, `corroborated`, `unverified`).
   - If logged in as Volunteer or Admin, click **Mark Verified** to test the two-tier verification workflow.

7. **Admin Console (`/admin`)**:
   - Inspect ingestion stream health (Open-Meteo, NASA GPM, CWC, NDMA CAP).
   - Review the **Model Cards** displaying benchmarked Brier scores, ROC-AUC, CSI, and MAE against persistence baselines.
   - Review the immutable system audit log.

8. **Science & Limitations Register (`/limitations`)**:
   - Review official mandate boundaries, ungauged catchment uncertainties, and privacy notes.

---

## 6. Statutory Notice
> *"Complements, does not replace, official warnings. Follow IMD, CWC, NDMA and your State Disaster Management Authority."*

