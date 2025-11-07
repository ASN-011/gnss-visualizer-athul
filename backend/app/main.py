from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="GNSS Viz Backend")

class Mission(BaseModel):
    mission_type: str  # "IoT" | "EO" | "COMM"
    ground_stations: int | None = None
    required_revisit_hours: float | None = None
    required_downlink_mbps: float | None = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/recommend")
def recommend(mission: Mission):
    recs = []
    if mission.mission_type.upper() == "IOT":
        recs += ["Store-and-forward payload", "UHF/VHF link", "High-count LEO smallsats"]
    elif mission.mission_type.upper() == "EO":
        if (mission.required_revisit_hours or 24) <= 12:
            recs += ["Sun-synchronous LEO", "Multiple planes (≥6)"]
        recs += ["Onboard compression", "X-band downlink"]
    else:  # COMM
        recs += ["Intersatellite links (optical)", "Phased array antennas"]

    if (mission.ground_stations or 1) < 2:
        recs.append("Add ground stations for coverage")

    return {
        "mission": mission.model_dump(),
        "recommendations": recs,
        "note": "Prototype stub – replace with real trade studies later"
    }
