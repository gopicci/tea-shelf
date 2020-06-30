import base64
import json
import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.reverse import reverse

PASSWORD = "pAssw0rd!"


@pytest.mark.django_db
def create_user(email="user@test.com", username="user", password=PASSWORD):
    return get_user_model().objects.create_user(
        email=email, username=username, password=password
    )


@pytest.mark.django_db
def test_user_can_register(client):
    response = client.post(
        reverse("register"),
        data={
            "email": "user@example.com",
            "username": "User",
            "password1": PASSWORD,
            "password2": PASSWORD,
        },
    )
    user = get_user_model().objects.last()
    assert status.HTTP_201_CREATED == response.status_code
    assert response.data["id"] == user.id
    assert response.data["email"] == user.email
    assert response.data["username"] == user.username


@pytest.mark.django_db
def test_user_can_login(client):
    user = create_user()
    response = client.post(
        reverse("login"), data={"email": user.email, "password": PASSWORD}
    )

    access = response.data["access"]
    header, payload, signature = access.split(".")
    decoded_payload = base64.b64decode(f"{payload}==")
    payload_data = json.loads(decoded_payload)

    assert status.HTTP_200_OK == response.status_code
    assert response.data["refresh"] is not None
    assert payload_data["id"] == user.id
    assert payload_data["email"] == user.email
    assert payload_data["username"] == user.username


@pytest.mark.django_db
def test_can_visit_user_info_page_when_login(client):
    user = create_user()
    client.login(email=user.email, password=PASSWORD)
    response = client.get(reverse("user_detail"))
    assert status.HTTP_200_OK == response.status_code
    assert response.data["email"] == user.email
    assert response.data["username"] == user.username


@pytest.mark.django_db
def test_cannot_visit_user_info_page_without_login(client):
    response = client.get(reverse("user_detail"))
    assert status.HTTP_401_UNAUTHORIZED == response.status_code
