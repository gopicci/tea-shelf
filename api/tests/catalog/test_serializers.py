import pytest

from datetime import timedelta

from catalog.serializers import (
    BrewingSerializer,
    BrewingSessionSerializer,
    OriginSerializer,
    CategorySerializer,
    SubcategorySerializer,
    VendorSerializer,
    TeaSerializer,
)
from catalog.models import Category, CustomUser


@pytest.mark.django_db
def test_valid_brewing_serializer(client):
    valid_serializer_data = {
        "temperature": 99,
        "weight": 3.5,
        "initial": timedelta(seconds=20),
        "increments": timedelta(seconds=5),
    }
    serializer = BrewingSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_brewing_serializer(client):
    invalid_serializer_data = {
        "temperature": 101,
        "weight": 3.5,
        "initial": timedelta(seconds=20),
        "increments": timedelta(seconds=5),
    }
    serializer = BrewingSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {
        "temperature": ["Ensure this value is less than or equal to 100."]
    }


@pytest.mark.django_db
def test_valid_origin_serializer(client):
    valid_serializer_data = {
        "country": "Poland",
        "region": "Yunnan",
        "locality": "Berlin",
    }
    serializer = OriginSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_origin_serializer(client):
    invalid_serializer_data = {"region": "Yunnan", "locality": "Berlin"}
    serializer = OriginSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"country": ["This field is required."]}


@pytest.mark.django_db
def test_valid_category_serializer(client):
    gongfu_data = {
        "temperature": 99,
        "weight": 3.5,
        "initial": timedelta(seconds=20),
        "increments": timedelta(seconds=5),
    }
    gongfu_serializer = BrewingSerializer(data=gongfu_data)
    assert gongfu_serializer.is_valid()
    western_data = {
        "temperature": 99,
        "weight": 1,
        "initial": timedelta(seconds=180),
        "increments": timedelta(seconds=30),
    }
    western_serializer = BrewingSerializer(data=western_data)
    assert western_serializer.is_valid()
    valid_serializer_data = {
        "name": "OOLONG",
        "gongfu_brewing": gongfu_serializer.validated_data,
        "western_brewing": western_serializer.validated_data,
    }
    serializer = CategorySerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_category_serializer(client):
    valid_serializer_data = {"name": "OOLONG"}
    serializer = CategorySerializer(data=valid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.errors != {}


@pytest.mark.django_db
def test_valid_subcategory_serializer(client):
    user = CustomUser(email="test@test.com")
    user.save()
    category = Category(name="OOLONG")
    category.save()
    valid_serializer_data = {"user": user, "name": "test", "category": category.id}
    serializer = SubcategorySerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert type(serializer.validated_data["category"]) == Category
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_subcategory_serializer(client):
    invalid_serializer_data = {"name": "test", "category": "OOLONG"}
    serializer = SubcategorySerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {
        "category": ["Incorrect type. Expected pk value, received str."]
    }


@pytest.mark.django_db
def test_valid_vendor_serializer(client):
    user = CustomUser(email="test@test.com")
    user.save()
    valid_serializer_data = {"user": user, "name": "test"}
    serializer = VendorSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data["name"] == "test"
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_vendor_serializer(client):
    user = CustomUser(email="test@test.com")
    user.save()
    invalid_serializer_data = {"name": "test", "popularity": 20}
    serializer = VendorSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {
        "popularity": ["Ensure this value is less than or equal to 10."]
    }


@pytest.mark.django_db
def test_valid_tea_serializer(client):
    valid_serializer_data = {"name": "test"}
    serializer = TeaSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_tea_serializer(client):
    invalid_serializer_data = {"year": 1980}
    serializer = TeaSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {"name": ["This field is required."]}


@pytest.mark.django_db
def test_valid_brewing_session_serializer(client):
    valid_serializer_data = {"brewing": {"temperature": 90}}
    serializer = BrewingSessionSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_brewing_session_serializer(client):
    invalid_serializer_data = {"current_infusion": 0}
    serializer = BrewingSessionSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {
        "current_infusion": ["Ensure this value is greater than or equal to 1."]
    }
