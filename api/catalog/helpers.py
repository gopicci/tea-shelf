def format_delta(delta):
    """
    Returns a formatted timedelta string.

    Args:
        delta: Timedelta input
    Returns:
        Formatted string, some examples:

        10s
        1:20m
        12h
    """
    seconds = int(delta.total_seconds() % 60)
    minutes = int((delta.total_seconds() // 60) % 60)
    hours = int(delta.total_seconds() // 3600)

    if hours:
        if minutes:
            return f"{hours}:{minutes:02d}h"
        else:
            return f"{hours}h"
    elif minutes:
        if seconds:
            return f"{minutes}:{(seconds % 60):02d}m"
        else:
            return f"{minutes}m"
    else:
        return f"{seconds}s"
