import pytest
from datetime import timedelta
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction

from catalog.models import (
    CustomUser,
    GongfuBrewing,
    WesternBrewing,
    Origin,
    Category,
    Subcategory,
    SubcategoryName,
    Vendor,
    VendorTrademark,
)


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


@pytest.mark.django_db
def test_gongfubrewing_model():
    brewing = GongfuBrewing(
        temperature=99,
        weight=Decimal(5),
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    brewing.save()
    assert brewing.temperature == 99
    assert brewing.weight.to_integral_value() == 5
    assert brewing.initial.total_seconds() == 10
    assert brewing.increments.total_seconds() == 3
    assert str(brewing) == "5g 99°c 10s + 3s"


@pytest.mark.django_db
def test_gongfubrewing_model_validators():
    brewing = GongfuBrewing(
        temperature=101,
        weight=Decimal(5),
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )

    with pytest.raises(ValidationError):
        brewing.full_clean()
        brewing.save()

    brewing = GongfuBrewing(
        temperature=99,
        weight=Decimal(-1),
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )

    with pytest.raises(ValidationError):
        brewing.full_clean()
        brewing.save()

    brewings = GongfuBrewing.objects.all()
    assert len(brewings) == 0

    brewing1 = GongfuBrewing(
        temperature=99,
        weight=Decimal(5),
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    brewing1.save()

    brewings = GongfuBrewing.objects.all()
    assert len(brewings) == 1

    brewing2 = GongfuBrewing(
        temperature=99,
        weight=Decimal(5),
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    with pytest.raises(IntegrityError):
        brewing2.save()

    with pytest.raises(transaction.TransactionManagementError):
        brewings = GongfuBrewing.objects.all()
        assert len(brewings) == 1


@pytest.mark.django_db
def test_westernbrewing_model():
    brewing = WesternBrewing(
        temperature=85, weight=Decimal(0.8), initial=timedelta(seconds=180)
    )
    brewing.save()
    assert brewing.temperature == 85
    assert brewing.weight == Decimal(0.8)
    assert brewing.initial.total_seconds() == 180
    assert str(brewing) == "0.8g 85°c 3m"


@pytest.mark.django_db
def test_westernbrewingg_model_validators():
    brewing = WesternBrewing(
        temperature=101, weight=Decimal(0.8), initial=timedelta(seconds=180)
    )

    with pytest.raises(ValidationError):
        brewing.full_clean()
        brewing.save()

    brewing = WesternBrewing(
        temperature=85, weight=Decimal(-2), initial=timedelta(seconds=180)
    )

    with pytest.raises(ValidationError):
        brewing.full_clean()
        brewing.save()

    brewings = WesternBrewing.objects.all()
    assert len(brewings) == 0

    brewing1 = WesternBrewing(
        temperature=85, weight=Decimal(2), initial=timedelta(seconds=180)
    )
    brewing1.save()

    brewings = WesternBrewing.objects.all()
    assert len(brewings) == 1

    brewing2 = WesternBrewing(
        temperature=85, weight=Decimal(2), initial=timedelta(seconds=180)
    )
    with pytest.raises(IntegrityError):
        brewing2.save()

    with pytest.raises(transaction.TransactionManagementError):
        brewings = WesternBrewing.objects.all()
        assert len(brewings) == 1


@pytest.mark.django_db
def test_origin_model():
    user = CustomUser(email="test@test.com", username="test")
    user.save()
    origin = Origin(country="Germany", region="Yunnan", locality="Paris", user=user)
    origin.save()
    assert origin.country == "Germany"
    assert origin.region == "Yunnan"
    assert origin.locality == "Paris"
    assert origin.user.username == "test"
    assert str(origin) == "Paris, Yunnan, Germany"


@pytest.mark.django_db
def test_origin_model_validators():
    user = CustomUser(email="test@test.com", username="test")
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
    gongfu = GongfuBrewing(
        temperature=99,
        weight=Decimal(5),
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    gongfu.save()
    western = WesternBrewing(
        temperature=85, weight=Decimal(0.8), initial=timedelta(seconds=180)
    )
    western.save()
    category = Category(name="OOLONG", gongfu_brewing=gongfu, western_brewing=western)
    category.save()
    assert category.name == "OOLONG"
    assert str(category.gongfu_brewing) == "5g 99°c 10s + 3s"
    assert type(category.western_brewing) == WesternBrewing


@pytest.mark.django_db
def test_subcategory_subcategoryname_model():
    user = CustomUser(email="test@test.com", username="test")
    user.save()
    category = Category(name="OOLONG")
    category.save()
    origin = Origin(country="Germany", region="Yunnan", locality="Paris", user=user)
    origin.save()
    gongfu = GongfuBrewing(
        temperature=99,
        weight=Decimal(5),
        initial=timedelta(seconds=10),
        increments=timedelta(seconds=3),
    )
    gongfu.save()
    western = WesternBrewing(
        temperature=85, weight=Decimal(0.8), initial=timedelta(seconds=180)
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
    assert subcategory.name == "Da Hong Pao"
    assert subcategory.category.name == "OOLONG"
    assert subcategory.translated_name == "Big Red Robe"
    assert subcategory.origin.locality == "Paris"
    assert subcategory.user.username == "test"
    assert subcategory.gongfu_brewing.temperature == 99
    assert subcategory.western_brewing.weight == Decimal(0.8)

    assert str(subcategory) == "Da Hong Pao"

    subcategoryname = SubcategoryName(subcategory=subcategory, name="dhp")
    subcategoryname.save()
    assert subcategoryname.name == "dhp"


@pytest.mark.django_db
def test_vendor_vendortrademark_model():
    user = CustomUser(email="test@test.com", username="test")
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
    assert str(vendor) == "vendor name"
    assert vendor.website == "www.vendor.com"
    assert vendor.origin.country == "Germany"
    assert vendor.user.email == "test@test.com"
    assert vendor.popularity == 7

    vendor_tm = VendorTrademark(vendor=vendor, name="vn")
    vendor_tm.save()
    assert vendor_tm.vendor.name == "vendor name"
    assert str(vendor_tm) == "vn"
