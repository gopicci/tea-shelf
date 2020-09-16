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
        """
        Checks for email and saves user with defaults and current times.
        """
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
        """
        Default is_active.
        """
        return self._create_user(email, password, False, True, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """
        Default is_active, is_staff and is_superuser.
        """
        return self._create_user(email, password, True, True, True, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Model defining a custom user with unique email and UUID PK.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField("Email", max_length=255, unique=True)
    is_staff = models.BooleanField("Is staff", default=False)
    is_active = models.BooleanField("Is active", default=True)
    joined_at = models.DateTimeField("Joined at", default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email


class Brewing(models.Model):
    """
    Model defining a set of brewing instructions.
    Temperature is in Celsius, weight in grams, initial brewing time and increments in seconds.
    The combination of all fields serves as unique constraint.
    """

    temperature = models.PositiveSmallIntegerField(
        default=0, validators=[MaxValueValidator(100)], null=True, blank=True
    )
    weight = models.FloatField(
        default=0, validators=[MinValueValidator(0)], null=True, blank=True
    )
    initial = models.DurationField(default=timedelta(seconds=0), null=True, blank=True)
    increments = models.DurationField(
        default=timedelta(seconds=0), null=True, blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["temperature", "weight", "initial", "increments"],
                name="unique_brewing",
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
        Returns weight, temperature, initial brewing time and increments
        in standard tea brewing style "5g 99°c 20s +5s".
        """
        return (
            str(int(self.weight) if self.weight.is_integer() else "%.1f" % self.weight)
            + "g "
            + str(self.temperature)
            + "°c "
            + format_delta(self.initial)
            + " +"
            + format_delta(self.increments)
        )


class Origin(models.Model):
    """
    Model defining a geographic indication.
    Country definition is required and a combination of country,
    region and locality serves as unique constraint.
    """

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)

    country = models.CharField(max_length=30)
    region = models.CharField(max_length=50, blank=True)
    locality = models.CharField(max_length=50, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        ordering = ["country", "region", "locality"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "country", "region", "locality"], name="unique_origin"
            ),
            models.UniqueConstraint(
                fields=["user", "country", "region"],
                condition=models.Q(locality=None),
                name="unique_region_origin",
            ),
            models.UniqueConstraint(
                fields=["user", "country", "locality"],
                condition=models.Q(region=None),
                name="unique_locality_origin",
            ),
        ]

    def __str__(self):
        """
        Returns an origin name in "locality, region, country" format.
        """
        origin_name = ""
        if self.locality:
            origin_name += str(self.locality) + ", "
        if self.region:
            origin_name += str(self.region) + ", "
        origin_name += str(self.country)
        return origin_name


class Category(models.Model):
    """
    Model defining a macro tea category.
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
    description = models.TextField(blank=True)
    description_source = models.CharField(max_length=100, blank=True)
    gongfu_brewing = models.ForeignKey(
        Brewing, related_name="+", on_delete=models.SET_NULL, null=True, blank=True
    )
    western_brewing = models.ForeignKey(
        Brewing, related_name="+", on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.name


class CategoryName(models.Model):
    """
    Model defining a category alternative name, used to help with text recognition.
    """

    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

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
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, null=True, blank=True
    )
    description = models.TextField(blank=True)
    description_source = models.CharField(max_length=100, blank=True)

    gongfu_brewing = models.ForeignKey(
        Brewing, related_name="+", on_delete=models.SET_NULL, null=True, blank=True
    )
    western_brewing = models.ForeignKey(
        Brewing, related_name="+", on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        """
        Returns subcategory name in "name (translated_name)" format
        """
        if self.translated_name:
            return f"{self.name} ({self.translated_name})"
        return self.name


class SubcategoryName(models.Model):
    """
    Model defining a subcategory alternative name, uded to help with text recognition.
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
    Model defining common vendor trademarks, used to help parsing text from image.
    """

    name = models.CharField(max_length=50)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


def get_upload_path(instance, filename):
    """
    Image upload path
    """
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
        Category, on_delete=models.CASCADE, null=True, blank=True
    )
    subcategory = models.ForeignKey(
        Subcategory, on_delete=models.SET_NULL, null=True, blank=True
    )
    origin = models.ForeignKey(Origin, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)

    gongfu_preferred = models.BooleanField(default=True)
    gongfu_brewing = models.ForeignKey(
        Brewing, related_name="+", on_delete=models.SET_NULL, null=True, blank=True
    )
    western_brewing = models.ForeignKey(
        Brewing, related_name="+", on_delete=models.SET_NULL, null=True, blank=True
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

    def __str__(self):
        return self.name
