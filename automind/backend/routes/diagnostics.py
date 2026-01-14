from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "../data/final_diagnostics.json")


def load_diagnostics():
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError("final_diagnostics.json not found")

    with open(DATA_FILE, "r") as f:
        return json.load(f)


# ✅ RAW ML OUTPUT (for debugging / analytics)
@router.get("/diagnostics")
def get_diagnostics():
    try:
        return load_diagnostics()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="final_diagnostics.json not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ UI-READY ALERTS (for React dashboard)
@router.get("/alerts")
def get_alerts():
    try:
        diagnostics = load_diagnostics()
        alerts = []

        # 🔴 Engine Critical Alert
        if diagnostics.get("engine_prob", 0) >= 0.9:
            alerts.append({
                "id": "engine-critical-001",
                "title": "Engine Overheating Risk",
                "description": (
                    "AI detected a critical engine overheating condition. "
                    "Immediate service is strongly recommended."
                ),
                "severity": "critical",
                "status": "active",
                "predictedFailureWindow": "Within 48 hours",
                "aiConfidence": int(diagnostics["engine_prob"] * 100),
            })

        # 🟠 Bearing Warning Alert
        if diagnostics.get("bearing_prob", 0) >= 0.4:
            alerts.append({
                "id": "bearing-warning-001",
                "title": "Bearing Wear Detected",
                "description": (
                    "Bearing wear probability is elevated. "
                    "Inspection is recommended."
                ),
                "severity": "high",
                "status": "active",
                "predictedFailureWindow": "Within 7 days",
                "aiConfidence": int(diagnostics["bearing_prob"] * 100),
            })

        # 🟢 Fallback
        if not alerts:
            alerts.append({
                "id": "vehicle-ok-001",
                "title": "Vehicle Operating Normally",
                "description": "No critical issues detected by AI diagnostics.",
                "severity": "low",
                "status": "resolved",
                "predictedFailureWindow": "N/A",
                "aiConfidence": 95,
            })

        return alerts

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="final_diagnostics.json not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
