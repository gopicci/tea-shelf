import pytest
import json
from django.test import override_settings


auth_override = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
            "rest_framework_simplejwt.authentication.JWTAuthentication",
            "rest_framework.authentication.SessionAuthentication",
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


@pytest.fixture(scope='function')
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
    resp = client.get('/api/categories/')
    assert resp.status_code == 401
    resp = client.get('/api/brewings/gongfu/')
    assert resp.status_code == 401
    resp = client.get('/api/brewings/gongfu/0/')
    assert resp.status_code == 401
    resp = client.get('/api/brewings/western/')
    assert resp.status_code == 401
    resp = client.get('/api/brewings/western/0/')
    assert resp.status_code == 401
    resp = client.get('/api/origin/0/')
    assert resp.status_code == 401


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_list_categories(client, token):
    resp = client.get("/api/categories/",
                      HTTP_AUTHORIZATION=f'Bearer {token}')
    assert resp.status_code == 200


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_create_and_view_gongfu_brewing_instructions(client, token):
    resp = client.post('/api/brewings/gongfu/',
                       {"temperature": 99,
                        "weight": 3.5,
                        "initial": 20,
                        "increments": 5
                        },
                       content_type="application/json",
                       HTTP_AUTHORIZATION=f'Bearer {token}'
                       )
    assert resp.status_code == 201
    assert resp.data["weight"] == "3.5"
    _id = resp.data["id"]
    resp = client.get(f"/api/brewings/gongfu/{_id}/",
                      HTTP_AUTHORIZATION=f'Bearer {token}')
    assert resp.status_code == 200
    assert resp.data['temperature'] == 99
    assert resp.data['initial'] == "00:00:20"
    assert resp.data['increments'] == "00:00:05"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_create_and_view_western_brewing_instructions(client, token):
    resp = client.post('/api/brewings/western/',
                       {"temperature": 85,
                        "weight": 0.8,
                        "initial": 185
                        },
                       content_type="application/json",
                       HTTP_AUTHORIZATION=f'Bearer {token}'
                       )
    assert resp.status_code == 201
    assert resp.data["weight"] == "0.8"
    _id = resp.data["id"]
    resp = client.get(f"/api/brewings/western/{_id}/",
                      HTTP_AUTHORIZATION=f'Bearer {token}')
    assert resp.status_code == 200
    assert resp.data['temperature'] == 85
    assert resp.data['initial'] == "00:03:05"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_user_can_create_and_view_origin(client, token):
    resp = client.post('/api/origin/',
                       {"country": 'France',
                        "region": 'Oregon',
                        "locality": 'Taipei'
                        },
                       content_type="application/json",
                       HTTP_AUTHORIZATION=f'Bearer {token}'
                       )
    assert resp.status_code == 201
    _id = resp.data["id"]
    resp = client.get(f"/api/origin/{_id}/",
                      HTTP_AUTHORIZATION=f'Bearer {token}')
    assert resp.status_code == 200
    assert resp.data["user"] == "test"
    assert resp.data["country"] == "France"
    assert resp.data["region"] == "Oregon"
    assert resp.data["locality"] == "Taipei"
