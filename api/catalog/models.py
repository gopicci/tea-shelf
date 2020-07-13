import os
import uuid
from datetime import timedelta

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from .helpers import format_delta


class UserManager(BaseUserManager):
    """
    Defining custom user creation.
    """

    def _create_user(
        self, email, password, is_staff, is_active, is_superuser, **extra_fields
    ):
        if not email:
            raise ValueError("Users must have an email address")

        now = timezone.now()
        user = self.model(
            email=self.normalize_email(email),
            is_staff=is_staff,
            is_active=is_active,
            is_superuser=is_superuser,
            last_login=now,
            joined_at=now,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        is_active = int(os.environ.get("DEBUG", default=0)) == 1
        return self._create_user(
            email, password, False, is_active, False, **extra_fields
        )

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True, True, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Model defining a custom user with email as identifier.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField("Email", max_length=255, unique=True)
    is_staff = models.BooleanField("Is staff", default=False)
    is_active = models.BooleanField("Is active", default=True)
    joined_at = models.DateTimeField("Joined at", default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class GongfuBrewing(models.Model):
    """
    Model defining a set of gongfu brewing instructions.
    Temperature in Celsius, weight in grams, initial brewing time and increments in seconds.
    """

    temperature = models.PositiveSmallIntegerField(
        default=99, validators=[MaxValueValidator(100)], null=True, blank=True
    )
    weight = models.FloatField(
        default=5, validators=[MinValueValidator(0)], null=True, blank=True
    )
    initial = models.DurationField(default=timedelta(seconds=20), null=True, blank=True)
    increments = models.DurationField(
        default=timedelta(seconds=5), null=True, blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["temperature", "weight", "initial", "increments"],
                name="unique_gongfu",
            )
        ]

    def save(self, *args, **kwargs):
        """
        Truncates weight to 1 decimal.
        """
        self.weight = float("%.1f" % self.weight)
        super().save(*args, **kwargs)

    def __str__(self):
        """
        Returns weight, temperature, initial brewing time, brewing time increments
        in standard gongfu brewing style, ie: 5g 99°c 20s +5
        """
        return (
            str(int(self.weight) if self.weight.is_integer() else "%.1f" % self.weight)
            + "g "
            + str(self.temperature)
            + "°c "
            + format_delta(self.initial)
            + " + "
            + format_delta(self.increments)
        )


class WesternBrewing(models.Model):
    """
    Model defining a set of western brewing instructions.
    Temperature in Celsius, weight in grams, brewing time in seconds.
    """

    temperature = models.PositiveSmallIntegerField(
        default=99, validators=[MaxValueValidator(100)], null=True, blank=True
    )
    weight = models.FloatField(
        default=1, validators=[MinValueValidator(0)], null=True, blank=True
    )
    initial = models.DurationField(default=timedelta(minutes=2), null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["temperature", "weight", "initial"], name="unique_western"
            )
        ]

    def save(self, *args, **kwargs):
        """
        Truncates weight to 1 decimal.
        """
        self.weight = float("%.1f" % self.weight)
        super().save(*args, **kwargs)

    def __str__(self):
        """
        Returns weight, temperature, brewing time
        in standard western brewing style, ie: 1g 99°c 2m
        """
        return (
            str(int(self.weight) if self.weight.is_integer() else "%.1f" % self.weight)
            + "g "
            + str(self.temperature)
            + "°c "
            + format_delta(self.initial)
        )


class Origin(models.Model):
    """
    Model defining a geographic indication.
    """

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)

    country = models.CharField(max_length=30)
    region = models.CharField(max_length=50, blank=True)
    locality = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ["country", "region", "locality"]
        constraints = [
            models.UniqueConstraint(
                fields=["country", "region", "locality"], name="unique_origin"
            ),
            models.UniqueConstraint(
                fields=["country", "region"],
                condition=models.Q(locality=None),
                name="unique_region_origin",
            ),
            models.UniqueConstraint(
                fields=["country", "locality"],
                condition=models.Q(region=None),
                name="unique_locality_origin",
            ),
        ]

    def __str__(self):
        origin_name = ""
        if self.locality:
            origin_name += str(self.locality) + ", "
        if self.region:
            origin_name += str(self.region) + ", "
        origin_name += str(self.country)
        return origin_name


class Category(models.Model):
    """
    Model defining a macro tea category with suggested brewing instructions.
    """

    CATEGORIES = (
        ("WHITE", "WHITE"),
        ("YELLOW", "YELLOW"),
        ("GREEN", "GREEN"),
        ("OOLONG", "OOLONG"),
        ("BLACK", "BLACK"),
        ("FERMENTED", "FERMENTED"),
        ("HERBAL", "HERBAL"),
        ("SCENTED", "SCENTED"),
        ("OTHER", "OTHER"),
    )
    name = models.CharField(max_length=20, choices=CATEGORIES)
    gongfu_brewing = models.ForeignKey(
        GongfuBrewing, on_delete=models.SET_NULL, null=True, blank=True
    )
    western_brewing = models.ForeignKey(
        WesternBrewing, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    """
    Model defining a tea subcategory.
    """

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)

    name = models.CharField(max_length=50)
    translated_name = models.CharField(max_length=50, blank=True)
    origin = models.ForeignKey(Origin, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    gongfu_brewing = models.ForeignKey(
        GongfuBrewing, on_delete=models.SET_NULL, null=True, blank=True
    )
    western_brewing = models.ForeignKey(
        WesternBrewing, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        if self.translated_name:
            return f"{self.name} ({self.translated_name})"
        return self.name


class SubcategoryName(models.Model):
    """
    Model defining a subcategory alternative names.
    """

    name = models.CharField(max_length=50)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Vendor(models.Model):
    """
    Model defining a vendor.
    """

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)

    name = models.CharField(max_length=50)
    website = models.CharField(max_length=50, blank=True)
    origin = models.ForeignKey(Origin, on_delete=models.SET_NULL, null=True, blank=True)

    popularity = models.PositiveSmallIntegerField(
        default=5, validators=[MaxValueValidator(10)], null=True, blank=True
    )

    def __str__(self):
        return self.name


class VendorTrademark(models.Model):
    """
    Model defining common vendors trademarks to help with text from image parsing.
    """

    name = models.CharField(max_length=50)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


def get_upload_path(instance, filename):
    return f"{instance.user.id}/{filename}"


class Tea(models.Model):
    """
    Model defining a tea entry.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_archived = models.BooleanField(default=False)
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to=get_upload_path, null=True, blank=True)
    year = models.SmallIntegerField(
        validators=[MinValueValidator(1900), MaxValueValidator(2100)],
        null=True,
        blank=True,
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    subcategory = models.ForeignKey(
        Subcategory, on_delete=models.SET_NULL, null=True, blank=True
    )
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)

    gongfu_preferred = models.BooleanField(default=True)
    gongfu_brewing = models.ForeignKey(
        GongfuBrewing, on_delete=models.SET_NULL, null=True, blank=True
    )
    western_brewing = models.ForeignKey(
        WesternBrewing, on_delete=models.SET_NULL, null=True, blank=True
    )

    created_on = models.DateTimeField(auto_now_add=True)
    last_consumed_on = models.DateTimeField(auto_now=True)

    price = models.FloatField(
        default=0, validators=[MinValueValidator(0)], null=True, blank=True
    )

    weight_left = models.FloatField(
        default=0, validators=[MinValueValidator(0)], null=True, blank=True
    )
    weight_consumed = models.FloatField(
        default=0, validators=[MinValueValidator(0)], null=True, blank=True
    )

    rating = models.SmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        null=True,
        blank=True,
    )
    notes = models.TextField(max_length=10000, null=True, blank=True)


