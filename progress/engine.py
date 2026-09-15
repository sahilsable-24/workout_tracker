from decimal import Decimal
from enum import Enum

class SuggestionType(str,Enum):
    INCREASE_REPS = "increase_reps"
    INCREASE_WEIGHT = "increase_weight"
    REPEAT = "repeat"
    INSUFFICIENT_DATA = "insufficient_data"

def suggest_progression(
        previous_sets: list[tuple[int,Decimal]],
        current_sets: list[tuple[int,Decimal]]
) -> SuggestionType:

    # 1. Different number of sets -> can't cleanly compare, bail out
    if len(previous_sets) != len(current_sets):
        return SuggestionType.INSUFFICIENT_DATA
    
    #2. Different Weights -> can't compare, bail out
    all_weights = [w for _,w in previous_sets] + [w for _,w in current_sets]
    if len(set(all_weights)) !=1 :
        return SuggestionType.INSUFFICIENT_DATA

    #3. Check every set improved or matched
    improved = all(
        current_reps >= previous_reps 
        for (previous_reps, _), (current_reps,_) in zip(previous_sets,current_sets)
    )

    if not improved:
         return SuggestionType.REPEAT

    # 4. Improved on every set -> apply the rep-threshold rule
    current_reps_example = current_sets[0][0]

    if current_reps_example < 12:
        return SuggestionType.INCREASE_REPS
    else:
        return SuggestionType.INCREASE_WEIGHT 






    # All improved, low reps -> should suggest increasing reps
print(suggest_progression(
    previous_sets=[(10, Decimal("60")), (10, Decimal("60")), (9, Decimal("60"))],
    current_sets=[(10, Decimal("60")), (10, Decimal("60")), (10, Decimal("60"))]
))

# All improved, reps already at 12 -> should suggest increasing weight
print(suggest_progression(
    previous_sets=[(12, Decimal("60")), (12, Decimal("60"))],
    current_sets=[(12, Decimal("60")), (12, Decimal("60"))]
))

# Reps dropped on one set -> should suggest repeat
print(suggest_progression(
    previous_sets=[(10, Decimal("60")), (10, Decimal("60"))],
    current_sets=[(10, Decimal("60")), (8, Decimal("60"))]
))

# Weight changed -> insufficient data
print(suggest_progression(
    previous_sets=[(10, Decimal("60"))],
    current_sets=[(10, Decimal("55"))]
))  

    