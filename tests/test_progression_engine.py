from decimal import Decimal
from progress.engine import suggest_progression, SuggestionType


def test_all_sets_improved_under_12_reps_suggests_more_reps():
    result = suggest_progression(
        previous_sets=[(10, Decimal("60")), (10, Decimal("60")), (9, Decimal("60"))],
        current_sets=[(10, Decimal("60")), (10, Decimal("60")), (10, Decimal("60"))]
    )
    assert result == SuggestionType.INCREASE_REPS


def test_all_sets_matched_at_12_reps_suggests_weight_increase():
    result = suggest_progression(
        previous_sets=[(12, Decimal("60")), (12, Decimal("60"))],
        current_sets=[(12, Decimal("60")), (12, Decimal("60"))]
    )
    assert result == SuggestionType.INCREASE_WEIGHT


def test_reps_dropped_suggests_repeat():
    result = suggest_progression(
        previous_sets=[(10, Decimal("60")), (10, Decimal("60"))],
        current_sets=[(10, Decimal("60")), (8, Decimal("60"))]
    )
    assert result == SuggestionType.REPEAT


def test_different_weight_returns_insufficient_data():
    result = suggest_progression(
        previous_sets=[(10, Decimal("60"))],
        current_sets=[(10, Decimal("55"))]
    )
    assert result == SuggestionType.INSUFFICIENT_DATA


def test_different_set_count_returns_insufficient_data():
    result = suggest_progression(
        previous_sets=[(10, Decimal("60")), (10, Decimal("60")), (10, Decimal("60"))],
        current_sets=[(10, Decimal("60")), (10, Decimal("60"))]
    )
    assert result == SuggestionType.INSUFFICIENT_DATA