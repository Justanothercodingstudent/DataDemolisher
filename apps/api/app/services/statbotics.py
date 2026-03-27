import httpx

from ..config import settings


async def fetch_event_epa(event_key: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(f"{settings.statbotics_base_url}/event/{event_key}/teams")
    resp.raise_for_status()
    return resp.json()
