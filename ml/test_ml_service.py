import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from main import predict_flood, predict_drought, health_check, FloodInput, DroughtInput

def test_ml_health():
    res = health_check()
    assert res["status"] == "healthy"
    assert "flood" in res["models"]
    assert "drought" in res["models"]

def test_flood_prediction():
    payload = FloodInput(
        rainfall_24h_mm=65.0,
        rainfall_6h_mm=22.0,
        soil_moisture_pct=82.0,
        river_stage_m=535.8,
        warning_stage_m=535.5,
        danger_stage_m=537.0,
        rate_of_rise_m_per_hr=0.15,
        telemetry_latency_hrs=0.5,
        is_imputed=False
    )
    res = predict_flood(payload)
    assert 0.0 <= res["calibrated_probability"] <= 1.0
    assert res["risk_tier"] in ["Low", "Watch", "Elevated", "High"]
    assert "surge_interval" in res
    assert res["surge_interval"]["confidence_level_pct"] == 90
    assert len(res["drivers"]) >= 3
    assert "statutory_notice" in res

def test_drought_prediction():
    payload = DroughtInput(
        precip_deficit_30d_pct=45.0,
        soil_moisture_root_pct=18.0,
        temp_anomaly_c=2.5,
        consecutive_dry_days=24,
        telemetry_latency_hrs=1.0,
        is_imputed=False
    )
    res = predict_drought(payload)
    assert "spei_3_estimate" in res
    assert res["risk_tier"] in ["Low", "Watch", "Elevated", "High"]
    assert res["data_quality_score"] > 50
    assert "statutory_notice" in res
