"""
Search Demand Provider for Yatri Setu.
Simulates forward-looking tourist intent via search volume, OTA inquiries,
and travel query velocity for Himalayan destinations.
"""
import re
import logging
from datetime import datetime, date, timedelta
from typing import Optional, Dict, List, Any, Set
from app.services.data_sources.base import BaseDataSourceProvider, DataSourceReading

logger = logging.getLogger(__name__)


# Baseline monthly search interest multiplier (indexed around 1.0)
MONTHLY_SEARCH_MULTIPLIER: Dict[int, float] = {
    1: 0.85,   # Jan (post-new-year cooling)
    2: 0.90,   # Feb
    3: 1.15,   # Mar (spring surge)
    4: 1.35,   # Apr (peak summer escape search)
    5: 1.45,   # May (peak summer query volume)
    6: 1.10,   # Jun (early monsoon dip)
    7: 0.65,   # Jul (monsoon bottom)
    8: 0.60,   # Aug (landslide concerns)
    9: 1.05,   # Sep (autumn puja prep queries)
    10: 1.40,  # Oct (Durga puja peak searches)
    11: 1.25,  # Nov (clear mountain view queries)
    12: 1.35   # Dec (winter holiday / snow search)
}

# Base search score per destination (0-100 scale)
DESTINATION_BASE_SEARCH: Dict[str, float] = {
    "darjeeling": 82.0,  # Highest organic search volume
    "kalimpong": 52.0,
    "mirik": 42.0,
    "lava": 28.0,
    "lolegaon": 22.0,
    "rishop": 18.0
}

# Expected 24h baseline query volume for cold-start anchoring (aligned with demand_aggregation_service)
DESTINATION_BASELINE_VOLUME_24H: Dict[str, float] = {
    "darjeeling": 380.0,
    "kalimpong": 145.0,
    "mirik": 85.0,
    "lava": 42.0,
    "lolegaon": 30.0,
    "rishop": 24.0
}


def attribute_search_query(query: Optional[str]) -> Optional[str]:
    """
    Deterministically attributes a free-text search query to a single canonical destination.
    Reuses the canonical destination registry and alias definitions.

    Safety Rules:
    - If query is empty or None -> returns None
    - If query directly normalizes to a canonical destination -> returns canonical ID
    - If query contains words/phrases matching exactly ONE canonical destination -> returns canonical ID
    - If query matches MULTIPLE canonical destinations (e.g. 'darjeeling to kalimpong') -> returns None (ambiguous, never guess)
    - If query matches ZERO canonical destinations (e.g. 'himalayan views', 'delhi flights') -> returns None
    """
    if not query:
        return None

    clean_q = str(query).strip().lower()
    if not clean_q:
        return None

    # 1. Direct registry normalization
    try:
        from app.services.historical.destination_registry import normalize_destination_id
        return normalize_destination_id(clean_q)
    except (ValueError, TypeError):
        pass

    from app.services.historical.destination_registry import CANONICAL_DESTINATIONS, DESTINATION_ALIASES

    matched_destinations: Set[str] = set()

    # 2. Check known aliases (replace underscores with spaces for phrase matching)
    for alias_pattern, canonical_target in DESTINATION_ALIASES.items():
        norm_alias = alias_pattern.replace("_", " ")
        pattern = r"\b" + re.escape(norm_alias) + r"\b"
        if re.search(pattern, clean_q):
            matched_destinations.add(canonical_target)

    # 3. Check canonical destinations
    for c_dest in CANONICAL_DESTINATIONS:
        pattern = r"\b" + re.escape(c_dest) + r"\b"
        if re.search(pattern, clean_q):
            matched_destinations.add(c_dest)

    # Strict single-destination attribution:
    # Exactly one distinct canonical destination matched -> attributed
    # 0 or >1 (ambiguous) -> unattributed
    if len(matched_destinations) == 1:
        return next(iter(matched_destinations))

    return None


def attribute_event_destination(
    event_type: str,
    destination_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> Optional[str]:
    """
    Safely resolves the canonical destination ID for an incoming demand event.
    Only allows 'search' and 'destination_selection' event types to contribute to search demand.
    Returns canonical destination_id, or None if unattributed or unsupported event type.
    """
    from app.services.historical.destination_registry import is_canonical_destination, normalize_destination_id

    clean_type = str(event_type).strip().lower()
    meta = metadata or {}

    if clean_type == "destination_selection":
        if destination_id and is_canonical_destination(destination_id):
            return normalize_destination_id(destination_id)
        meta_dest = meta.get("destination_id")
        if meta_dest and is_canonical_destination(meta_dest):
            return normalize_destination_id(meta_dest)
        return None

    elif clean_type == "search":
        if destination_id and is_canonical_destination(destination_id):
            return normalize_destination_id(destination_id)
        query = meta.get("query")
        return attribute_search_query(query)

    # Bookings, availability, trip_starts, and alternatives are explicitly excluded
    # from search demand to prevent double-counting across signal layers.
    return None


def is_synthetic_event(event: Dict[str, Any]) -> bool:
    """
    Detects any synthetic, demo, or non-first-party markers on a telemetry event.
    Returns True if synthetic/demo (must be isolated and excluded from REAL demand).
    """
    if event.get("is_synthetic") is True:
        return True

    source = str(event.get("source") or "").upper()
    if source == "SYNTHETIC_DEMO" or "SYNTHETIC" in source or "DEMO" in source:
        return True

    provenance = str(event.get("provenance") or "").upper()
    if "SYNTHETIC" in provenance or "DEMO" in provenance:
        return True

    meta = event.get("metadata") or event.get("metadata_json") or {}
    if isinstance(meta, dict):
        if meta.get("is_synthetic") is True:
            return True
        meta_prov = str(meta.get("provenance") or "").upper()
        if "SYNTHETIC" in meta_prov or "DEMO" in meta_prov:
            return True

    return False


class MockSearchDemandProvider(BaseDataSourceProvider):
    """
    Provides normalized search interest index (0-100) reflecting
    pre-booking interest on search engines and OTA aggregators.
    Preserved for backwards compatibility and unit testing.
    """
    PROVIDER_TYPE = "MOCK"

    def get_reading(self, destination_id: str, date_str: Optional[str] = None) -> DataSourceReading:
        dest_clean = destination_id.lower().strip()
        base_search = DESTINATION_BASE_SEARCH.get(dest_clean, 35.0)

        target_month = date.today().month
        if date_str:
            try:
                target_month = datetime.strptime(date_str, "%Y-%m-%d").month
            except ValueError:
                pass

        multiplier = MONTHLY_SEARCH_MULTIPLIER.get(target_month, 1.0)
        calculated_score = min(100.0, max(5.0, base_search * multiplier))

        trend_label = "Surging" if calculated_score > 75 else ("Moderate" if calculated_score > 40 else "Low")

        # Track leading indicator metrics
        query_index = round(calculated_score * 12.5, 0)
        unique_searchers = int(query_index * 0.78)
        booking_conversion = 0.08 if calculated_score > 60 else 0.14
        period_change = round((multiplier - 1.0) * 100.0, 1)

        return DataSourceReading(
            value=round(calculated_score, 1),
            available=True,
            source="MOCK_SEARCH_DEMAND_LEADING_INDEX",
            confidence=0.88,
            raw_value=query_index,
            unit="query_velocity_index",
            provider_mode="MOCK",
            data_quality="HIGH",
            signal_type="SEARCH_DEMAND",
            notes=f"Leading indicator: {trend_label} intent ({unique_searchers} unique queries, {period_change:+.1f}% period change, {booking_conversion*100:.1f}% conversion)"
        )

    def get_demand_metrics(self, destination_id: str) -> dict:
        """Detailed demand observation tracking search leading indicators."""
        dest_clean = destination_id.lower().strip()
        base_search = DESTINATION_BASE_SEARCH.get(dest_clean, 35.0)
        target_month = date.today().month
        multiplier = MONTHLY_SEARCH_MULTIPLIER.get(target_month, 1.0)
        calculated_score = min(100.0, max(5.0, base_search * multiplier))
        query_index = int(calculated_score * 12.5)

        trend = "RISING" if multiplier > 1.1 else ("DECLINING" if multiplier < 0.9 else "STABLE")

        return {
            "destination_id": dest_clean,
            "search_count": query_index,
            "unique_searchers": int(query_index * 0.78),
            "booking_conversion": 0.08 if calculated_score > 60 else 0.14,
            "period_change_percent": round((multiplier - 1.0) * 100.0, 1),
            "trend": trend,
            "is_leading_indicator": True,
            "notes": "Leading demand indicator reflects forward booking intent, not instantaneous physical presence."
        }


class FirstPartySearchDemandProvider(BaseDataSourceProvider):
    """
    First-party Search Demand Provider for Yatri Setu.
    Aggregates genuine destination-attributed search and destination_selection events
    from PostgreSQL demand_events (with in-memory cache resilience).

    Design Principles:
    - Primary Signal: Destination-attributed 'search' events (weight = 1.0).
    - Supporting Intent Signal: 'destination_selection' events (weight = 0.5).
    - Strictly Excludes: Bookings (handled by booking_demand), availability checks,
      and all synthetic/demo events.
    - Cold-Start Strategy: When observed volume is 0 in 24h, falls back to calibrated
      baseline prior labeled 'MOCK' with reduced confidence.
    - Blended Normalization: Bayesian shrinkage blending of observed search velocity
      with calibrated baseline prior, bounded strictly to 0.0-100.0.
    - Provenance: Reports provider_mode='REAL' and source='YATRI_SETU_FIRST_PARTY_SEARCH'
      only when genuine first-party events contributed.
    """
    PROVIDER_TYPE: str = "REAL"
    PROVIDER_MODE: str = "REAL"

    def _collect_events(self, cutoff: datetime) -> List[Dict[str, Any]]:
        """
        Collects demand events from PostgreSQL via SessionLocal and active in-memory cache.
        Deduplicates by event ID.
        """
        collected: Dict[str, Dict[str, Any]] = {}

        # 1. Query PostgreSQL demand_events
        db = None
        try:
            from app.core.database import SessionLocal
            from app.models.entities import DemandEventModel
            db = SessionLocal()
            db_rows = db.query(DemandEventModel).filter(
                DemandEventModel.timestamp >= cutoff,
                DemandEventModel.event_type.in_(["search", "destination_selection"])
            ).all()
            for row in db_rows:
                collected[row.id] = {
                    "id": row.id,
                    "destination_id": row.destination_id,
                    "event_type": row.event_type,
                    "session_id": row.session_id,
                    "user_id": row.user_id,
                    "metadata": row.metadata_json or {},
                    "source": row.source,
                    "timestamp": row.timestamp,
                }
        except Exception as e:
            logger.debug(f"Database demand_events read skipped: {e}")
        finally:
            if db:
                db.close()

        # 2. Inspect active in-memory cache in demand_aggregation_service
        try:
            from app.services.demand_aggregation_service import demand_aggregation_service
            for ev in demand_aggregation_service._events:
                ev_ts = ev.get("timestamp")
                if ev_ts and ev_ts >= cutoff:
                    ev_id = ev.get("id") or f"mem_{id(ev)}"
                    if ev_id not in collected:
                        collected[ev_id] = ev
        except Exception as e:
            logger.debug(f"In-memory demand_aggregation_service read skipped: {e}")

        return list(collected.values())

    def get_reading(self, destination_id: str, date_str: Optional[str] = None) -> DataSourceReading:
        from app.services.historical.destination_registry import normalize_destination_id

        # 1. Canonical destination normalization
        try:
            dest_clean = normalize_destination_id(destination_id)
        except (ValueError, TypeError):
            return DataSourceReading(
                value=35.0,
                available=False,
                source="YATRI_SETU_FIRST_PARTY_SEARCH",
                confidence=0.0,
                notes=f"Destination '{destination_id}' is not one of the six canonical destinations.",
                provider_mode="UNAVAILABLE",
                data_quality="DEGRADED",
                signal_type="SEARCH_DEMAND"
            )

        now = datetime.utcnow()
        cutoff_24h = now - timedelta(hours=24)
        cutoff_7d = now - timedelta(days=7)

        # 2. Retrieve events across 7-day window
        events = self._collect_events(cutoff_7d)

        search_24h = 0
        search_7d = 0
        dest_sel_24h = 0
        dest_sel_7d = 0

        for ev in events:
            # Synthetic Data Isolation: Exclude any synthetic or demo events
            if is_synthetic_event(ev):
                continue

            ev_type = str(ev.get("event_type") or "").strip().lower()
            if ev_type not in ("search", "destination_selection"):
                continue

            # Attribute event to canonical destination
            ev_dest = attribute_event_destination(
                event_type=ev_type,
                destination_id=ev.get("destination_id"),
                metadata=ev.get("metadata") or ev.get("metadata_json")
            )

            if ev_dest != dest_clean:
                continue

            ev_ts = ev.get("timestamp") or now
            if ev_type == "search":
                if ev_ts >= cutoff_24h:
                    search_24h += 1
                if ev_ts >= cutoff_7d:
                    search_7d += 1
            elif ev_type == "destination_selection":
                if ev_ts >= cutoff_24h:
                    dest_sel_24h += 1
                if ev_ts >= cutoff_7d:
                    dest_sel_7d += 1

        # 3. Calculate effective intent volume:
        # Primary search: weight 1.0; Supporting destination selection: weight 0.5
        obs_volume_24h = float(search_24h) + (0.5 * float(dest_sel_24h))
        obs_volume_7d = float(search_7d) + (0.5 * float(dest_sel_7d))

        baseline_score = DESTINATION_BASE_SEARCH.get(dest_clean, 35.0)
        expected_baseline_volume = DESTINATION_BASELINE_VOLUME_24H.get(dest_clean, 50.0)

        # 4. Trend calculation across 24h vs 7d pace
        daily_avg_7d = obs_volume_7d / 7.0 if obs_volume_7d > 0 else 0.0
        if obs_volume_24h > 0 and daily_avg_7d > 0:
            trend_ratio = obs_volume_24h / max(1.0, daily_avg_7d)
            if trend_ratio >= 1.20:
                trend_label = "RISING"
            elif trend_ratio <= 0.80:
                trend_label = "DECLINING"
            else:
                trend_label = "STABLE"
        else:
            trend_label = "STABLE"

        # 5. Normalization, Cold-Start Blending, and Provenance Assignment
        if obs_volume_24h == 0.0:
            # Cold-start fallback: 0 real events observed in 24h
            # Uses calibrated baseline prior without claiming REAL data
            provider_mode = "MOCK"
            source = "MOCK_SEARCH_DEMAND_BASELINE"
            final_value = baseline_score
            confidence = 0.60
            data_quality = "LOW" if obs_volume_7d == 0 else "MEDIUM"
            notes = (
                f"Cold start baseline prior: 0 genuine search events in 24h. "
                f"Using calibrated regional prior ({baseline_score:.1f})."
            )
        else:
            # Genuine real events observed
            provider_mode = "REAL"
            source = "YATRI_SETU_FIRST_PARTY_SEARCH"

            # Dynamic demand scaling based on volume relative to expected baseline
            volume_ratio = obs_volume_24h / max(1.0, expected_baseline_volume)
            observed_score = baseline_score * (0.40 + 0.60 * min(2.5, volume_ratio))

            # Bounded Bayesian blend: transition smoothly as sample size increases toward 20 events
            sample_weight = min(1.0, obs_volume_24h / 20.0)
            blended_score = (1.0 - sample_weight) * baseline_score + sample_weight * observed_score
            final_value = round(min(100.0, max(5.0, blended_score)), 1)

            # Confidence and data quality scale with real sample size
            if obs_volume_24h >= 20.0:
                confidence = 0.95
                data_quality = "HIGH"
            elif obs_volume_24h >= 5.0:
                confidence = 0.85
                data_quality = "MEDIUM"
            else:
                confidence = 0.70
                data_quality = "LOW"

            notes = (
                f"First-party telemetry: {search_24h} searches, {dest_sel_24h} views in 24h "
                f"({trend_label} trend, {obs_volume_24h:.1f} effective intent). "
                f"Blended with calibrated baseline prior ({baseline_score:.1f})."
            )

        return DataSourceReading(
            value=final_value,
            available=True,
            source=source,
            confidence=confidence,
            raw_value=float(search_24h),
            unit="searches_24h",
            provider_mode=provider_mode,
            data_quality=data_quality,
            signal_type="SEARCH_DEMAND",
            notes=notes
        )

    def get_demand_metrics(self, destination_id: str) -> dict:
        """Detailed first-party demand observation tracking search leading indicators."""
        reading = self.get_reading(destination_id)
        dest_clean = destination_id.lower().strip()
        return {
            "destination_id": dest_clean,
            "search_count": int(reading.raw_value or 0),
            "normalized_score": reading.value,
            "provider_mode": reading.provider_mode,
            "source": reading.source,
            "confidence": reading.confidence,
            "data_quality": reading.data_quality,
            "is_leading_indicator": True,
            "notes": reading.notes
        }


# Canonical production provider instance
search_demand_provider = FirstPartySearchDemandProvider()

