import httpx

from ..config import settings


async def fetch_event(event_key: str) -> dict:
    headers = {"X-TBA-Auth-Key": settings.tba_api_key} if settings.tba_api_key else {}
    async with httpx.AsyncClient(timeout=20) as client:
        event_resp = await client.get(f"{settings.tba_base_url}/event/{event_key}", headers=headers)
        matches_resp = await client.get(f"{settings.tba_base_url}/event/{event_key}/matches/simple", headers=headers)
        teams_resp = await client.get(f"{settings.tba_base_url}/event/{event_key}/teams/simple", headers=headers)
    event_resp.raise_for_status()
    matches_resp.raise_for_status()
    teams_resp.raise_for_status()
    return {"event": event_resp.json(), "matches": matches_resp.json(), "teams": teams_resp.json()}
