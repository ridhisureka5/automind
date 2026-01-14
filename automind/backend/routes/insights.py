from fastapi import APIRouter

router = APIRouter(prefix="/insights", tags=["Insights"])

# TEMP MOCK DATA (replace with DB later)
@router.get("")
def get_insights():
    return [
        {
            "id": 1,
            "component": "Engine",
            "status": "identified",
            "priority": "critical",
            "rootCause": "Overheating due to coolant leakage",
            "failureCount": 12,
            "affectedVehicles": 340,
            "feedbackSentToManufacturing": False
        },
        {
            "id": 2,
            "component": "Brake Pads",
            "status": "resolved",
            "priority": "medium",
            "rootCause": "Premature wear",
            "failureCount": 8,
            "affectedVehicles": 120,
            "feedbackSentToManufacturing": True
        }
    ]


@router.post("/{insight_id}/feedback")
def send_feedback(insight_id: int, payload: dict):
    return {"status": "ok", "insight_id": insight_id}
