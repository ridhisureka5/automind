from fastapi import APIRouter, HTTPException
import pandas as pd
import joblib
import os
import traceback

router = APIRouter()


# =====================================================
# PATH SETUP
# =====================================================

CURRENT_FILE = os.path.abspath(__file__)

# backend/routes
ROUTES_DIR = os.path.dirname(CURRENT_FILE)

# backend
BACKEND_DIR = os.path.dirname(ROUTES_DIR)

# project root
PROJECT_DIR = os.path.dirname(BACKEND_DIR)


# =====================================================
# FILE PATHS
# =====================================================

DATA_PATH = os.path.join(
    BACKEND_DIR,
    "data",
    "dataset.csv"
)

MODEL_DIR = os.path.join(
    PROJECT_DIR,
    "ml_model"
)

FAILURE_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "failure_prediction_model.pkl"
)

ENCODER_PATH = os.path.join(
    MODEL_DIR,
    "driving_pattern_encoder.pkl"
)

SERVICE_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "service_demand_forecast_model.pkl"
)


# =====================================================
# LOAD MODELS + DATA
# =====================================================

try:

    df = pd.read_csv(DATA_PATH)

    failure_model = joblib.load(FAILURE_MODEL_PATH)

    encoder = joblib.load(ENCODER_PATH)

    service_model = joblib.load(SERVICE_MODEL_PATH)

    print("✅ DATA & MODELS LOADED")

except Exception as e:

    print("❌ LOAD ERROR:", e)

    df = None
    failure_model = None
    encoder = None
    service_model = None


# =====================================================
# DIAGNOSTICS API
# =====================================================

@router.get("/diagnostics")
def get_diagnostics():

    try:

        if df is None or failure_model is None or service_model is None:
            raise Exception("Models or Data not loaded")


        # =================================================
        # LOAD DATA
        # =================================================

        data = pd.read_csv(DATA_PATH)


        # =================================================
        # FEATURE ENGINEERING (FAILURE MODEL)
        # =================================================

        # Encode driving pattern
        data["driving_pattern_encoded"] = encoder.transform(
            data["driving_pattern"].astype(str)
        )

        # Rolling averages
        data["engine_temp_avg_3"] = data["engine_temp"].rolling(3).mean()
        data["oil_pressure_avg_3"] = data["oil_pressure"].rolling(3).mean()
        data["vibration_avg_3"] = data["vibration"].rolling(3).mean()

        # Fill NaN
        data = data.bfill()


        # =================================================
        # LATEST ROW
        # =================================================

        latest = data.iloc[-1:]
        raw = data.iloc[-1]


        # =================================================
        # FAILURE MODEL INPUT (EXACT ORDER)
        # =================================================

        failure_features = list(
            failure_model.feature_names_in_
        )

        failure_latest = latest[failure_features]


        # =================================================
        # FAILURE PREDICTION
        # =================================================

        failure_prob = float(
            failure_model.predict_proba(failure_latest)[0][1]
        )


        # =================================================
        # FEATURE ENGINEERING (SERVICE MODEL)
        # =================================================

        # Convert timestamp
        data["timestamp"] = pd.to_datetime(data["timestamp"])

        # Create day index
        data["day_index"] = (
            data["timestamp"] - data["timestamp"].min()
        ).dt.days


        # =================================================
        # SERVICE MODEL INPUT (EXACT ORDER)
        # =================================================

        service_latest = data.iloc[-1:].copy()

        service_features = list(
            service_model.feature_names_in_
        )

        service_latest = service_latest[service_features]


        # =================================================
        # SERVICE PREDICTION
        # =================================================

        service_demand = int(
            service_model.predict(service_latest)[0]
        )


        # =================================================
        # RESPONSE
        # =================================================

        return {

            "vehicle_id": str(raw["vehicle_id"]),

            "timestamp": str(raw["timestamp"]),

            "final_risk": round(failure_prob, 3),

            "service_demand": service_demand,

            "engine_temp": float(raw["engine_temp"]),

            "vibration": float(raw["vibration"]),

            "oil_pressure": float(raw["oil_pressure"]),

            "rpm": int(raw["rpm"]),

            "mileage": int(raw["mileage"]),

            "past_failures": int(raw["past_failures"]),

            "driving_pattern": str(raw["driving_pattern"]),

            "stress_index": float(raw["stress_index"]),

            "dtc_code": str(raw["dtc_code"])
        }


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as err:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Diagnostics failed: {str(err)}"
        )



# =====================================================
# ALERTS API (NO MORE 404)
# =====================================================

@router.get("/alerts")
def get_alerts():

    try:

        alerts = []

        data = pd.read_csv(DATA_PATH)
        latest = data.iloc[-1]

        # Rule: High engine temp
        if latest["engine_temp"] > 100:

            alerts.append({
                "id": 1,
                "title": "High Engine Temperature",
                "message": "Engine temperature is above safe limit",
                "severity": "critical"
            })

        # Rule: High stress
        if latest["stress_index"] > 80:

            alerts.append({
                "id": 2,
                "title": "High Vehicle Stress",
                "message": "Vehicle stress level is high",
                "severity": "warning"
            })


        return alerts

    except Exception:

        return []
