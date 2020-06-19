import pytest

from catalog.models import CustomUser


@pytest.mark.django_db
def test_custom_user_model():
    user = CustomUser(email="test@test.com", username="test")
    user.save()
    assert user.email == "test@test.com"
    assert user.username == "test"
    assert user.joined_at
    assert user.is_active
    assert not user.is_staff
    assert not user.is_superuser
    assert str(user) == user.email
