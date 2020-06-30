import pytest
from catalog.models import CustomUser


@pytest.mark.django_db
def test_register(client):
    users = CustomUser.objects.all()
    assert len(users) == 0

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
    assert resp.status_code == 201
    assert resp.data["username"] == "test"

    users = CustomUser.objects.all()
    assert len(users) == 1


@pytest.mark.django_db
def test_register_bad_json(client):
    users = CustomUser.objects.all()
    assert len(users) == 0

    resp = client.post(
        "/api/register/",
        {"email": "test@test.com", "password1": "pAzzw0rd!", "password2": "pizza"},
        content_type="application/json",
    )
    assert resp.status_code == 400

    users = CustomUser.objects.all()
    assert len(users) == 0

    resp = client.post(
        "/api/register/",
        {"username": "test", "password1": "pAzzw0rd!", "password2": "pAzzw0rd!"},
        content_type="application/json",
    )
    assert resp.status_code == 400

    users = CustomUser.objects.all()
    assert len(users) == 0


@pytest.mark.django_db
def test_register_different_passwords(client):
    users = CustomUser.objects.all()
    assert len(users) == 0

    resp = client.post(
        "/api/register/",
        {
            "username": "test",
            "email": "test@test.com",
            "password1": "pAzzw0rd!",
            "password2": "pizza",
        },
        content_type="application/json",
    )
    assert resp.status_code == 400

    users = CustomUser.objects.all()
    assert len(users) == 0


@pytest.mark.django_db
def test_can_login(client):
    users = CustomUser.objects.all()
    assert len(users) == 0

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
    assert resp.status_code == 201
    assert resp.data["username"] == "test"

    users = CustomUser.objects.all()
    assert len(users) == 1
    resp = client.post(
        "/api/login/",
        {"email": "test@test.com", "password": "pAzzw0rd!"},
        content_type="application/json",
    )
    assert resp.status_code == 200
    assert resp.data["access"]


@pytest.mark.django_db
def test_wrong_login(client):
    resp = client.post(
        "/api/login/",
        {"email": "test@test.com", "password": "pAzzw0rd!"},
        content_type="application/json",
    )
    assert str(resp.status_code)[0] == "4"


@pytest.mark.django_db
def test_logged_in_can_access_user_page(client):
    users = CustomUser.objects.all()
    assert len(users) == 0

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
    assert resp.status_code == 201
    assert resp.data["username"] == "test"

    users = CustomUser.objects.all()
    assert len(users) == 1

    resp = client.post(
        "/api/login/",
        {"email": "test@test.com", "password": "pAzzw0rd!"},
        content_type="application/json",
    )
    assert resp.status_code == 200
    assert resp.data["access"]
    resp = client.get("/api/user/",
                      HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')
    assert resp.status_code == 200
    assert resp.data["username"] == "test"


@pytest.mark.django_db
def test_token_refresh(client):
    users = CustomUser.objects.all()
    assert len(users) == 0

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
    assert resp.status_code == 201
    assert resp.data["username"] == "test"

    users = CustomUser.objects.all()
    assert len(users) == 1

    resp = client.post(
        "/api/login/",
        {"email": "test@test.com", "password": "pAzzw0rd!"},
        content_type="application/json",
    )
    assert resp.status_code == 200
    assert resp.data["access"]

    access_token = resp.data["access"]
    refresh_token = resp.data["refresh"]

    resp = client.get("/api/user/",
                      HTTP_AUTHORIZATION=f'Bearer {access_token}')
    assert resp.status_code == 200
    assert resp.data["username"] == "test"

    resp = client.post("/api/token/refresh/",
                       {'refresh': refresh_token},
                       content_type="application/json"
                       )
    assert resp.data["access"]
    new_access_token = resp.data["access"]
    assert new_access_token != access_token

    resp = client.get("/api/user/",
                      HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
    assert resp.status_code == 200
    assert resp.data["username"] == "test"


@pytest.mark.django_db
def test_anonymous_cannot_access_user_page(client):
    resp = client.get("/api/user/", content_type="application/json")
    assert str(resp.status_code)[0] == "4"


@pytest.mark.django_db
def test_logout(client):
    users = CustomUser.objects.all()
    assert len(users) == 0

    client.post(
        "/api/register/",
        {
            "username": "test",
            "email": "test@test.com",
            "password1": "pAzzw0rd!",
            "password2": "pAzzw0rd!",
        },
        content_type="application/json",
    )
    client.post(
        "/api/login/",
        {"email": "test@test.com", "password": "pAzzw0rd!"},
        content_type="application/json",
    )
    client.post("/api/logout/", content_type="application/json")
    resp = client.get("/api/user/", content_type="application/json")
    assert str(resp.status_code)[0] == "4"
