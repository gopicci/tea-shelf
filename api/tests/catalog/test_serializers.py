import pytest

from datetime import timedelta
from decimal import Decimal

from catalog.serializers import GongfuBrewingSerializer, WesternBrewingSerializer, OriginSerializer, CategorySerializer, SubcategorySerializer, SubcategoryNameSerializer
from catalog.models import Category, Subcategory, CustomUser

@pytest.mark.django_db
def test_valid_gongfu_brewing_serializer(client):
    valid_serializer_data = {'temperature': 99,
                             'weight': Decimal(3.5),
                             'initial': timedelta(seconds=20),
                             'increments': timedelta(seconds=5)}
    serializer = GongfuBrewingSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_gongfu_brewing_serializer(client):
    invalid_serializer_data = {'temperature': 101,
                               'weight': Decimal(3.5),
                               'initial': timedelta(seconds=20),
                               'increments': timedelta(seconds=5)}
    serializer = GongfuBrewingSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {'temperature': ['Ensure this value is less than or equal to 100.']}


@pytest.mark.django_db
def test_valid_western_brewing_serializer(client):
    valid_serializer_data = {'temperature': 99,
                             'weight': Decimal(1),
                             'initial': timedelta(seconds=180)}
    serializer = WesternBrewingSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_western_brewing_serializer(client):
    invalid_serializer_data = {'temperature': 99,
                               'weight': Decimal(-1),
                               'initial': timedelta(seconds=180)}
    serializer = WesternBrewingSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {'weight': ['Ensure this value is greater than or equal to 0.']}


@pytest.mark.django_db
def test_valid_origin_serializer(client):
    valid_serializer_data = {'country': 'Poland', 'region': 'Yunnan', 'locality': 'Berlin'}
    serializer = OriginSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data == valid_serializer_data
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_origin_serializer(client):
    invalid_serializer_data = {'region': 'Yunnan', 'locality': 'Berlin'}
    serializer = OriginSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {'country': ['This field is required.']}


@pytest.mark.django_db
def test_valid_category_serializer(client):
    valid_serializer_data = {'name': 'OOLONG'}
    serializer = CategorySerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.errors == {}


@pytest.mark.django_db
def test_valid_subcategory_serializer(client):
    category = Category(name='OOLONG')
    category.save()
    valid_serializer_data = {'name': 'test', 'category': category.id}
    serializer = SubcategorySerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert type(serializer.validated_data['category']) == Category
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_subcategory_serializer(client):
    invalid_serializer_data = {'name': 'test', 'category': 'OOLONG'}
    serializer = SubcategorySerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {'category': ['Incorrect type. Expected pk value, received str.']}


@pytest.mark.django_db
def test_valid_subcategoryname_serializer(client):
    user = CustomUser(email="test@test.com", username="test")
    user.save()
    category = Category(name='OOLONG')
    category.save()
    subcategory = Subcategory(name='sub', category=category, user=user)
    subcategory.save()
    valid_serializer_data = {'name': 'test', 'subcategory': subcategory.id}
    serializer = SubcategoryNameSerializer(data=valid_serializer_data)
    assert serializer.is_valid()
    assert serializer.validated_data['name'] == valid_serializer_data['name']
    assert type(serializer.validated_data['subcategory']) == Subcategory
    assert serializer.errors == {}


@pytest.mark.django_db
def test_invalid_subcategoryname_serializer(client):
    invalid_serializer_data = {'name': 'test'}
    serializer = SubcategoryNameSerializer(data=invalid_serializer_data)
    assert not serializer.is_valid()
    assert serializer.data == invalid_serializer_data
    assert serializer.errors == {'subcategory': ['This field is required.']}
