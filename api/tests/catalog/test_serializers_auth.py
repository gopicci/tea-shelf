import pytest

from catalog.serializers import LoginSerializer, UserSerializer


@pytest.mark.django_db
def test_valid_login_serializer(client):
    client.post(
        "/api/register/",
        {"email": "test@test.com", "password1": "pAzzw0rd!", "password2": "pAzzw0rd!",},
        content_type="application/json",
    )

    valid_serializer_data = {"email": "test@test.com", "password": "pAzzw0rd!"}
    serializer = LoginSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data["access"] is not None
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_login_serializer_missing_field(client):
    client.post(
        "/api/register/",
        {"email": "test@test.com", "password1": "pAzzw0rd!", "password2": "pAzzw0rd!",},
        content_type="application/json",
    )

    invalid_serializer_data = {"email": "test@test.com"}
    serializer = LoginSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"password": ["This field is required."]}

    invalid_serializer_data = {"password": "pAzzw0rd!"}
    serializer = LoginSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"email": ["This field is required."]}


@pytest.mark.django_db
def test_invalid_login_serializer_wrong_field(client):
    client.post(
        "/api/register/",
        {"email": "test@test.com", "password1": "pAzzw0rd!", "password2": "pAzzw0rd!",},
        content_type="application/json",
    )

    invalid_serializer_data = {"email": "test", "password": "pAzzw0rd!"}
    serializer = LoginSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"non_field_errors": ["Incorrect email or password."]}

    invalid_serializer_data = {"email": "est@test.com", "password": "wrong_password"}
    serializer = LoginSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"non_field_errors": ["Incorrect email or password."]}


@pytest.mark.django_db
def test_valid_user_serializer(client):

    valid_serializer_data = {
        "email": "test@test.com",
        "password1": "pAzzw0rd!",
        "password2": "pAzzw0rd!",
    }
    serializer = UserSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_user_serializer_password_mismatch(client):

    invalid_serializer_data = {
        "email": "test@test.com",
        "password1": "pAzzw0rd!",
        "password2": "pAzzw0rd!wrong",
    }
    serializer = UserSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"non_field_errors": ["Passwords must match."]}


@pytest.mark.django_db
def test_invalid_user_serializer_wrong_email_format(client):

    invalid_serializer_data = {
        "email": "test",
        "password1": "pAzzw0rd!",
        "password2": "pAzzw0rd!",
    }
    serializer = UserSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"email": ["Enter a valid email address."]}


@pytest.mark.django_db
def test_invalid_user_serializer_missing_field(client):

    invalid_serializer_data = {
        "email": "test@test.com",
        "password1": "pAzzw0rd!",
    }
    serializer = UserSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"password2": ["This field is required."]}

    invalid_serializer_data = {
        "password1": "pAzzw0rd!",
        "password2": "pAzzw0rd!",
    }
    serializer = UserSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.validated_data == {}
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"email": ["This field is required."]}
