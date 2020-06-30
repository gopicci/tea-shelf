import pytest
from django.test import override_settings
from catalog.models import Category

auth_override = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}


@pytest.fixture(scope="function")
@pytest.mark.django_db
def token(client):
    resp = client.post(
        "/api/register/",
        {
            "username": "test",
            "email": "test@test.com",
            "password1": "pAzzw0rd!",
            "password2": "pAzzw0rd!",
        },
        content_type="application/json",
    )
    resp = client.post(
        "/api/login/",
        {"email": "test@test.com", "password": "pAzzw0rd!"},
        content_type="application/json",
    )
    return resp.data["access"]


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_anon_cannot_reach_views(client):
    resp = client.get("/api/category/")
    assert resp.status_code == 401
    resp = client.get("/api/brewing/gongfu/")
    assert resp.status_code == 401
    resp = client.get("/api/brewing/gongfu/0/")
    assert resp.status_code == 401
    resp = client.get("/api/brewing/western/")
    assert resp.status_code == 401
    resp = client.get("/api/brewing/western/0/")
    assert resp.status_code == 401
    resp = client.get("/api/origin/0/")
    assert resp.status_code == 401


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_list_category(client, token):
    resp = client.get("/api/category/", HTTP_AUTHORIZATION=f"Bearer {token}")
    assert resp.status_code == 200


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_create_and_view_gongfu_brewing_instructions(client, token):
    resp = client.post(
        "/api/brewing/gongfu/",
        {"temperature": 99, "weight": 3.5, "initial": 20, "increments": 5},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.status_code == 201
    assert resp.data["weight"] == 3.5
    _id = resp.data["id"]
    resp = client.get(
        f"/api/brewing/gongfu/{_id}/", HTTP_AUTHORIZATION=f"Bearer {token}"
    )
    assert resp.status_code == 200
    assert resp.data["temperature"] == 99
    assert resp.data["initial"] == "00:00:20"
    assert resp.data["increments"] == "00:00:05"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_create_and_view_western_brewing_instructions(client, token):
    resp = client.post(
        "/api/brewing/western/",
        {"temperature": 85, "weight": 0.8, "initial": 185},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.status_code == 201
    assert resp.data["weight"] == 0.8
    _id = resp.data["id"]
    resp = client.get(
        f"/api/brewing/western/{_id}/", HTTP_AUTHORIZATION=f"Bearer {token}"
    )
    assert resp.status_code == 200
    assert resp.data["temperature"] == 85
    assert resp.data["initial"] == "00:03:05"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_create_and_view_origin(client, token):
    resp = client.post(
        "/api/origin/",
        {"country": "France", "region": "Oregon", "locality": "Taipei"},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.status_code == 201
    _id = resp.data["id"]
    resp = client.get(f"/api/origin/{_id}/", HTTP_AUTHORIZATION=f"Bearer {token}")
    assert resp.status_code == 200
    assert resp.data["user"]
    assert resp.data["country"] == "France"
    assert resp.data["region"] == "Oregon"
    assert resp.data["locality"] == "Taipei"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_create_and_view_subcategory(client, token):
    category = Category(name="OOLONG")
    category.save()
    resp = client.post(
        "/api/subcategory/",
        {"name": "Test", "translated_name": "Still test", "category": category.id},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.status_code == 201
    resp = client.get("/api/subcategory/", HTTP_AUTHORIZATION=f"Bearer {token}")
    assert resp.status_code == 200
    assert resp.data[0]["user"]
    assert resp.data[0]["name"] == "Test"
    assert resp.data[0]["translated_name"] == "Still test"
    assert resp.data[0]["category"] == category.id
