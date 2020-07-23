import os
import pytest
from datetime import timedelta

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError, transaction


from catalog.models import (
    CustomUser,
    Brewing,
    Origin,
    Category,
    Subcategory,
    SubcategoryName,
    Vendor,
    VendorTrademark,
    Tea,
)


@pytest.mark.django_db
def test_custom_user_model():
    user = CustomUser(email="test@test.com")
    user.save()
    assert user.email == "test@test.com"
    assert user.joined_at
    assert user.is_active
    assert not user.is_staff
    assert not user.is_superuser
    assert str(user) == user.email


@pytest.mark.django_db
def test_brewing_model():
    brewing = Brewing(
        temperature=99,
        weight=5.0076865,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    brewing.save()
    assert brewing.temperature == 99
    assert brewing.weight == 5
    assert brewing.initial.total_seconds() == 10
    assert brewing.increments.total_seconds() == 3
    assert str(brewing) == "5g 99°c 10s + 3s"


@pytest.mark.django_db
def test_brewing_model_validators():
    brewing = Brewing(
        temperature=101,
        weight=5,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )

    with pytest.raises(ValidationError):
        brewing.full_clean()
        brewing.save()

    brewing = Brewing(
        temperature=99,
        weight=-1,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )

    with pytest.raises(ValidationError):
        brewing.full_clean()
        brewing.save()

    brewings = Brewing.objects.all()
    assert len(brewings) == 0

    brewing1 = Brewing(
        temperature=99,
        weight=5,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    brewing1.save()

    brewings = Brewing.objects.all()
    assert len(brewings) == 1

    brewing2 = Brewing(
        temperature=99,
        weight=5,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    with pytest.raises(IntegrityError):
        brewing2.save()

    with pytest.raises(transaction.TransactionManagementError):
        brewings = Brewing.objects.all()
        assert len(brewings) == 1


@pytest.mark.django_db
def test_origin_model():
    user = CustomUser(email="test@test.com")
    user.save()
    origin = Origin(country="Germany", region="Yunnan", locality="Paris", user=user)
    origin.save()
    assert not origin.is_public
    assert origin.country == "Germany"
    assert origin.region == "Yunnan"
    assert origin.locality == "Paris"
    assert str(origin) == "Paris, Yunnan, Germany"


@pytest.mark.django_db
def test_origin_model_validators():
    user = CustomUser(email="test@test.com")
    user.save()
    origin1 = Origin(country="Germany", region="Yunnan", locality="Paris", user=user)
    origin1.save()

    origins = Origin.objects.all()
    assert len(origins) == 1

    origin2 = Origin(country="Germany", locality="Paris", user=user)
    origin2.save()

    origins = Origin.objects.all()
    assert len(origins) == 2

    origin3 = Origin(country="Germany", locality="Paris", user=user)
    with pytest.raises(IntegrityError):
        origin3.save()

    with pytest.raises(transaction.TransactionManagementError):
        origins = Origin.objects.all()
        assert len(origins) == 2


@pytest.mark.django_db
def test_category_model():
    gongfu = Brewing(
        temperature=99,
        weight=5,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    gongfu.save()
    western = Brewing(
        temperature=85,
        weight=0.8,
        initial=timedelta(seconds=180),
        increments=timedelta(seconds=30),
    )
    western.save()
    category = Category(name="OOLONG", gongfu_brewing=gongfu, western_brewing=western)
    category.save()
    assert category.name == "OOLONG"
    assert str(category.gongfu_brewing) == "5g 99°c 10s + 3s"
    assert type(category.western_brewing) == Brewing


@pytest.mark.django_db
def test_subcategory_subcategoryname_model():
    user = CustomUser(email="test@test.com")
    user.save()
    category = Category(name="OOLONG")
    category.save()
    origin = Origin(country="Germany", region="Yunnan", locality="Paris", user=user)
    origin.save()
    gongfu = Brewing(
        temperature=99,
        weight=5,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    gongfu.save()
    western = Brewing(
        temperature=85,
        weight=0.8,
        initial=timedelta(seconds=180),
        increments=timedelta(seconds=30),
    )
    western.save()
    subcategory = Subcategory(
        category=category,
        name="Da Hong Pao",
        translated_name="Big Red Robe",
        origin=origin,
        user=user,
        gongfu_brewing=gongfu,
        western_brewing=western,
    )
    subcategory.save()
    assert not subcategory.is_public
    assert subcategory.name == "Da Hong Pao"
    assert subcategory.category.name == "OOLONG"
    assert subcategory.translated_name == "Big Red Robe"
    assert subcategory.origin.locality == "Paris"
    assert subcategory.gongfu_brewing.temperature == 99
    assert subcategory.western_brewing.weight == 0.8

    assert str(subcategory) == "Da Hong Pao (Big Red Robe)"

    subcategoryname = SubcategoryName(subcategory=subcategory, name="dhp")
    subcategoryname.save()
    assert subcategoryname.name == "dhp"


@pytest.mark.django_db
def test_vendor_vendortrademark_model():
    user = CustomUser(email="test@test.com")
    user.save()
    origin = Origin(country="Germany", region="Yunnan", locality="Paris", user=user)
    origin.save()
    vendor = Vendor(
        name="vendor name",
        website="www.vendor.com",
        origin=origin,
        user=user,
        popularity=7,
    )
    vendor.save()
    assert not vendor.is_public
    assert str(vendor) == "vendor name"
    assert vendor.website == "www.vendor.com"
    assert vendor.origin.country == "Germany"
    assert vendor.user.email == "test@test.com"
    assert vendor.popularity == 7

    vendor_tm = VendorTrademark(vendor=vendor, name="vn")
    vendor_tm.save()
    assert vendor_tm.vendor.name == "vendor name"
    assert str(vendor_tm) == "vn"


@pytest.mark.django_db
def test_tea_model():
    user = CustomUser(email="test@test.com")
    user.save()
    category = Category(name="OOLONG")
    category.save()
    origin = Origin(country="Germany", region="Yunnan", locality="Paris", user=user)
    origin.save()
    gongfu = Brewing(
        temperature=99,
        weight=5,
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    gongfu.save()
    western = Brewing(
        temperature=85,
        weight=0.8,
        initial=timedelta(seconds=180),
        increments=timedelta(seconds=30),
    )
    western.save()
    subcategory = Subcategory(
        category=category,
        name="Da Hong Pao",
        translated_name="Big Red Robe",
        origin=origin,
        user=user,
        gongfu_brewing=gongfu,
        western_brewing=western,
    )
    subcategory.save()
    vendor = Vendor(
        name="vendor name",
        website="www.vendor.com",
        origin=origin,
        user=user,
        popularity=7,
    )
    vendor.save()
    tea = Tea(
        user=user,
        is_archived=True,
        name="Da Hong Pao",
        year=1980,
        category=category,
        subcategory=subcategory,
        vendor=vendor,
        gongfu_brewing=gongfu,
        western_brewing=western,
        price=109.52,
        weight_left=80,
        rating=8,
        notes="many notes",
    )
    tea.image = SimpleUploadedFile(
        name="image.jpg", content=open("tests/test_media/test_image.jpg", "rb").read(),
    )
    tea.save()
    assert tea.name == "Da Hong Pao"
    assert tea.year == 1980
    assert tea.user.email == "test@test.com"
    assert tea.is_archived
    assert tea.category.name == "OOLONG"
    assert tea.subcategory.translated_name == "Big Red Robe"
    assert tea.vendor.website == "www.vendor.com"
    assert tea.gongfu_preferred
    assert tea.gongfu_brewing.temperature == 99
    assert tea.western_brewing.weight == 0.8
    assert tea.price == 109.52
    assert tea.weight_left == 80
    assert tea.rating == 8
    assert tea.notes == "many notes"
    assert tea.created_on
    assert tea.last_consumed_on

    path = tea.image.name
    assert os.path.isfile(os.path.join(settings.MEDIA_ROOT, path))
    tea.image.delete()
    os.rmdir(os.path.join(settings.MEDIA_ROOT, os.path.dirname(path)))
    assert not os.path.isfile(path)


@pytest.mark.django_db
def test_tea_model_validators():
    user = CustomUser(email="test@test.com")
    user.save()
    tea = Tea(user=user, name="test", year=1800)
    with pytest.raises(ValidationError):
        tea.full_clean()
        tea.save()
    assert len(Tea.objects.all()) == 0

    tea = Tea(user=user, name="test", year=2200)
    with pytest.raises(ValidationError):
        tea.full_clean()
        tea.save()
    assert len(Tea.objects.all()) == 0

    tea = Tea(user=user, name="test", price=-1)
    with pytest.raises(ValidationError):
        tea.full_clean()
        tea.save()
    assert len(Tea.objects.all()) == 0

    tea = Tea(user=user, name="test", weight_left=-1)
    with pytest.raises(ValidationError):
        tea.full_clean()
        tea.save()
    assert len(Tea.objects.all()) == 0

    tea = Tea(user=user, name="test", weight_consumed=-1)
    with pytest.raises(ValidationError):
        tea.full_clean()
        tea.save()
    assert len(Tea.objects.all()) == 0

    tea = Tea(user=user, name="test", rating=-1)
    with pytest.raises(ValidationError):
        tea.full_clean()
        tea.save()
    assert len(Tea.objects.all()) == 0
