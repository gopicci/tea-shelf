import base64
import pytest
from django.core.management import call_command
from django.test import override_settings

from catalog.models import Category, Subcategory, Vendor

from .test_views import auth_override


@pytest.fixture(scope="function")
@pytest.mark.django_db
def token(client):
    resp = client.post(
        "/api/register/",
        {"email": "test@test.com", "password1": "pAzzw0rd!", "password2": "pAzzw0rd!"},
        content_type="application/json",
    )
    resp = client.post(
        "/api/login/",
        {"email": "test@test.com", "password": "pAzzw0rd!"},
        content_type="application/json",
    )
    return resp.data["access"]


@pytest.fixture(scope="session")
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command("loaddata", "catalog/fixtures/data-dev.json")


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_1(client, token):
    with open("tests/test_media/tea1.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Snow Phoenix"
    assert Category.objects.get(id=resp.data["category"]).name == "OOLONG"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Dan Cong"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "Van Cha"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_2(client, token):
    with open("tests/test_media/tea2.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "2014 B.C.Y. Ripe Pu Erh"
    assert Category.objects.get(id=resp.data["category"]).name == "FERMENTED"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Shou Pu-Erh"
    assert resp.data["year"] == 2014


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_3(client, token):
    with open("tests/test_media/tea3.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert Category.objects.get(id=resp.data["category"]).name == "FERMENTED"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Pu-Erh"
    assert resp.data["year"] == 1993
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "TWG"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_4(client, token):
    with open("tests/test_media/tea4.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Undercover Dhp"
    assert Category.objects.get(id=resp.data["category"]).name == "OOLONG"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Da Hong Pao"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "Mei Leaf"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_5(client, token):
    with open("tests/test_media/tea5.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Middle Mountain Dan Cong Oolong"
    assert Category.objects.get(id=resp.data["category"]).name == "OOLONG"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Ya Shi Xiang"
    assert resp.data["year"] == 2019
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "Yunnan Sourcing"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_6(client, token):
    with open("tests/test_media/tea6.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Ying De Hong Black Tea"
    assert Category.objects.get(id=resp.data["category"]).name == "BLACK"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Ying De Hong"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "The Chinese Tea Shop"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_7(client, token):
    with open("tests/test_media/tea7.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Yunnan Wild Gu Shu Black"
    assert Category.objects.get(id=resp.data["category"]).name == "BLACK"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "The Chinese Tea Shop"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_8(client, token):
    with open("tests/test_media/tea8.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert (
        resp.data["name"]
        == "2016 Cha Yu Lin Wang Xi Village Wild Tian Jian Hei Cha In Basket"
    )
    assert Category.objects.get(id=resp.data["category"]).name == "FERMENTED"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Hei Cha"
    assert resp.data["year"] == 2016


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_9(client, token):
    with open("tests/test_media/tea9.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "1990s Raw Pu Erh Ke Yi Xing"
    assert Category.objects.get(id=resp.data["category"]).name == "FERMENTED"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Sheng Pu-Erh"
    assert resp.data["year"] == 1990


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_10(client, token):
    with open("tests/test_media/tea10.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Premium Golden Tips Red Tea"
    assert Category.objects.get(id=resp.data["category"]).name == "BLACK"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Dian Hong"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_11(client, token):
    with open("tests/test_media/tea11.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Pala"
    assert Category.objects.get(id=resp.data["category"]).name == "BLACK"
    assert "vendor" not in resp.data


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_12(client, token):
    with open("tests/test_media/tea12.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Vintage 2005 Ba Jiao Ting Pu Erh Tea Cake"
    assert Category.objects.get(id=resp.data["category"]).name == "FERMENTED"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Sheng Pu-Erh"
    assert resp.data["year"] == 2005
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "Treasure Green"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_13(client, token):
    with open("tests/test_media/tea13.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Silver Needle White Tea"
    assert Category.objects.get(id=resp.data["category"]).name == "WHITE"
    assert (
        Subcategory.objects.get(id=resp.data["subcategory"]).name == "Baihao Yin Zhen"
    )
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "The Chinese Tea Shop"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_14(client, token):
    with open("tests/test_media/tea14.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert "Organic Cream" in resp.data["name"]
    assert "Earl Grey" in resp.data["name"]
    assert Category.objects.get(id=resp.data["category"]).name == "SCENTED"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Earl Grey"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "DAVIDsTEA"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_15(client, token):
    with open("tests/test_media/tea15.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert "Wild Sweet Orange" in resp.data["name"]
    assert Category.objects.get(id=resp.data["category"]).name == "HERBAL"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "Tazo"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_16(client, token):
    with open("tests/test_media/tea16.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Chrysanthemum Flower Tea"
    assert Category.objects.get(id=resp.data["category"]).name == "HERBAL"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Chrysanthemum"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_17(client, token):
    with open("tests/test_media/tea17.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert "Verde" in resp.data["name"]
    assert Category.objects.get(id=resp.data["category"]).name == "GREEN"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "Sir Winston"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_18(client, token):
    with open("tests/test_media/tea18.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "Zhejiang Wild Dragon Well Green Tea"
    assert Category.objects.get(id=resp.data["category"]).name == "GREEN"
    assert Subcategory.objects.get(id=resp.data["subcategory"]).name == "Long Jing"
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "What-Cha"


@override_settings(REST_FRAMEWORK=auth_override)
@pytest.mark.django_db
def test_vision_parser_image_19(client, token):
    with open("tests/test_media/tea19.jpg", "rb") as tea_image:
        encoded_image = base64.b64encode(tea_image.read())
    encoded_str = "data:image/png;base64," + str(encoded_image).strip("b'")
    resp = client.post(
        "/api/parser/",
        {"image": encoded_str},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}",
    )
    assert resp.data["name"] == "2019 Duh"
    assert resp.data["year"] == 2019
    assert "category" not in resp.data
    assert Vendor.objects.get(id=resp.data["vendor"]).name == "White2Tea"
