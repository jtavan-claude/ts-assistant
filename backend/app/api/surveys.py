"""HiPS survey catalog served to the frontend.

These are the surveys the sky view offers. NSNS (Northern Sky Narrowband Survey,
the Stellarium favourite) and DSS are all HiPS, so Aladin Lite loads them by URL.
NSNS only covers Dec >= ~-20 deg, hence DSS2 color as the all-sky default.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class Survey(BaseModel):
    id: str
    label: str
    # Aladin accepts either a HiPS base URL or a registered CDS id.
    url_or_id: str
    is_default: bool = False
    note: str | None = None


SURVEYS: list[Survey] = [
    Survey(
        id="dss2-color",
        label="DSS2 Color (all-sky)",
        # Pin the CDS/alasky mirror directly: the "CDS/P/DSS2/color" registry id
        # can resolve to an IRSA mirror that lacks CORS headers.
        url_or_id="https://alasky.cds.unistra.fr/DSS/DSSColor",
        is_default=True,
        note="Full-sky default base layer.",
    ),
    Survey(
        id="dss2-nir",
        label="DSS2 NIR",
        url_or_id="CDS/P/DSS2/NIR",
    ),
    # NSNS HiPS base URLs are under /nebulae3/<release>/<layer> (the
    # hips_service_url in each survey's properties). simg.de sends
    # Access-Control-Allow-Origin: *, so Aladin Lite can load them directly.
    # DR0.2 is the current release and adds [OIII] and [SII] over DR0.1; it has
    # no true-color layer, so True Color stays on DR0.1. Dec ≳ -20° coverage only.
    Survey(
        id="nsns-hbr8",
        label="NSNS Hα + continuum (color)",
        url_or_id="https://simg.de/nebulae3/dr0_2/hbr8",
        note="NSNS DR0.2; Dec ≳ -20° only.",
    ),
    Survey(
        id="nsns-halpha8",
        label="NSNS Hα",
        url_or_id="https://simg.de/nebulae3/dr0_2/halpha8",
        note="NSNS DR0.2; Dec ≳ -20° only.",
    ),
    Survey(
        id="nsns-oiii8",
        label="NSNS [OIII]",
        url_or_id="https://simg.de/nebulae3/dr0_2/oiii8",
        note="NSNS DR0.2; Dec ≳ -20° only.",
    ),
    Survey(
        id="nsns-sii8",
        label="NSNS [SII]",
        url_or_id="https://simg.de/nebulae3/dr0_2/sii8",
        note="NSNS DR0.2; Dec ≳ -20° only.",
    ),
    Survey(
        id="nsns-rgb8",
        label="NSNS RGB continuum",
        url_or_id="https://simg.de/nebulae3/dr0_2/rgb8",
        note="NSNS DR0.2; Dec ≳ -20° only.",
    ),
    Survey(
        id="nsns-tc8",
        label="NSNS True Color (DR0.1)",
        url_or_id="https://simg.de/nebulae3/dr0_1/tc8",
        note="NSNS DR0.1 (no true-color layer in DR0.2); Dec ≳ -20° only.",
    ),
    Survey(
        id="mellinger",
        label="Mellinger Color (wide field)",
        url_or_id="CDS/P/Mellinger/color",
    ),
]


@router.get("/surveys", response_model=list[Survey])
def get_surveys() -> list[Survey]:
    return SURVEYS
