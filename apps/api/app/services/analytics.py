from statistics import mean, pstdev


def consistency_score(values: list[float]) -> float:
    if not values:
        return 0.0
    m = mean(values)
    if m == 0:
        return 0.0
    score = 1 - (pstdev(values) / m)
    return max(0.0, min(100.0, score * 100))


def mock_match_prediction(red_strength: float, blue_strength: float) -> dict:
    total = max(0.01, red_strength + blue_strength)
    red_prob = red_strength / total
    return {
        "redWinProb": round(red_prob, 3),
        "blueWinProb": round(1 - red_prob, 3),
        "confidence": round(0.55 + abs(red_prob - 0.5), 3),
    }
