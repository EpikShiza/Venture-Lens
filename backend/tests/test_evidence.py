import pytest
from app.schemas.analysis import EvidenceItem
from app.services.search_provider import MockSearchProvider


@pytest.mark.asyncio
async def test_mock_search_provider_returns_valid_evidence():
    provider = MockSearchProvider()
    results = await provider.search("clinical trial regulatory saas", max_results=3)

    assert len(results) > 0
    for item in results:
        assert isinstance(item, EvidenceItem)
        assert item.url.startswith("http")
        assert len(item.title) > 5
        assert len(item.snippet) > 10
        assert item.verification_status in ["VERIFIED_SOURCE", "DERIVED_ESTIMATE", "UNVERIFIED_HYPOTHESIS"]


def test_evidence_item_schema_validation():
    item = EvidenceItem(
        title="Gartner Market Intelligence",
        url="https://www.gartner.com",
        snippet="Over 70% of enterprises plan to modernize legacy workflows.",
        retrieved_at="2026-10-17T10:00:00Z",
        verification_status="VERIFIED_SOURCE",
        relevance_note="Primary source benchmark",
    )
    assert item.title == "Gartner Market Intelligence"
    assert item.verification_status == "VERIFIED_SOURCE"
