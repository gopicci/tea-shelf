from django.core.exceptions import ValidationError


def validate_username(username):
    """
    Raise a validation error if username exists
    """
    from .models import CustomUser

    if CustomUser.objects.filter(
        **{"{}__iexact".format(CustomUser.USERNAME_FIELD): username}
    ).exists():
        raise ValidationError(
            "User with this {} already exists".format(CustomUser.USERNAME_FIELD)
        )
    return username
