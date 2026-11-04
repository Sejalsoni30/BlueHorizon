# Known Limitations & Uncertainty Register — BlueHorizon

BlueHorizon operates as an interpretive intelligence and community preparedness layer. It does NOT issue official hazard warnings and does NOT replace government forecasting.

## 1. Upstream Forecasting & Hydro-Meteorological Limitations
- **Google Flood Hub / LSTM Models**: Performance drops in ungauged or small catchment basins where historical training telemetry is absent. Upstream dam operations (unannounced water releases) are not modeled.
- **Central Water Commission (CWC)**: Point river stage readings do not directly compute hyperlocal overland flood depths. Rating curves suffer drift during heavy monsoon siltation.
- **IMD Heavy Rainfall Forecasts**: Quantitative Precipitation Forecasts (QPF) are given at district or sub-basin scale and cannot resolve street-level stormwater backing up in urban drainage bottlenecks.
- **Open-Meteo**: Numerical weather prediction ensembles (ECMWF, GFS, ICON) provide high-quality regional coverage but are subject to convective cloudburst timing errors.

## 2. Drought Monitoring Limitations
- **Standardized Indices (SPI/SPEI)**: Track statistical precipitation and evapotranspiration anomalies over 1- to 3-month scales; they do not immediately capture sub-surface deep aquifer extraction or artificial canal irrigation.
- **Soil Moisture**: Modeled root-zone soil moisture ($0-28\text{ cm}$) indicates topsoil desiccation but may not reflect drought resistance in deep-rooted perennials or irrigated crops.

## 3. Telemetry & Data Freshness Gaps
- Physical gauge stations experience transmission latency, telemetry dropouts, or power failures during severe cyclones and heavy cloudbursts.
- When station latency exceeds 6 hours, BlueHorizon automatically switches to "Degraded Confidence" and falls back to satellite reanalysis.

## 4. Legal & Operational Boundaries
- **Statutory Notice**: Complements, does not replace, official warnings. Always follow IMD, CWC, NDMA, and your State Disaster Management Authority (SDMA).
- **Hypothetical What-If Simulator**: The simulator is purely a dynamic heuristic scenario model for educational preparedness planning and does NOT generate operational forecasts.

