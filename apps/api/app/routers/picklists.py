from fastapi import APIRouter

router = APIRouter(prefix="/picklists", tags=["picklists"])


@router.get("/active")
def get_active_picklist(eventKey: str):
    return {
        "eventKey": eventKey,
        "name": "Primary Picklist",
        "tiers": {
            "A": [2056, 1114, 3538],
            "B": [1678, 254, 4414],
            "Sleeper": [2481, 5460],
            "DoNotPick": [],
        },
    }
