import os
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

    def get_by_natural_key(self, username):
        return self.get(**{"{}__iexact".format(self.model.USERNAME_FIELD): username})

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

    email = models.EmailField("Email", max_length=255, unique=True)
    username = models.CharField("Name", max_length=255, blank=False)
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

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username


class GongfuBrewing(models.Model):
    """
    Model defining a set of gongfu brewing instructions.
    Temperature in Celsius, weight in grams, initial brewing time and increments in seconds.
    """
    temperature = models.PositiveSmallIntegerField(default=99,
                                                   validators=[MaxValueValidator(100)],
                                                   null=True,
                                                   blank=True)
    weight = models.DecimalField(default=5,
                                 validators=[MinValueValidator(0)],
                                 max_digits=3,
                                 decimal_places=1,
                                 null=True,
                                 blank=True)
    initial = models.DurationField(default=timedelta(seconds=20),
                                   null=True,
                                   blank=True)
    increments = models.DurationField(default=timedelta(seconds=5),
                                      null=True,
                                      blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['temperature', 'weight', 'initial', 'increments'],
                                    name='unique_gongfu')
        ]

    def __str__(self):
        """
        Returns weight, temperature, initial brewing time, brewing time increments
        in standard gongfu brewing style, ie: 5g 99°c 20s +5
        """
        iw = self.weight.to_integral_value()

        return str(iw if iw == self.weight else '%.1f' % self.weight) \
            + 'g ' \
            + str(self.temperature) \
            + '°c ' \
            + format_delta(self.initial) \
            + ' + ' \
            + format_delta(self.increments)


class WesternBrewing(models.Model):
    """
    Model defining a set of western brewing instructions.
    Temperature in Celsius, weight in grams, brewing time in seconds.
    """
    temperature = models.PositiveSmallIntegerField(default=99,
                                                   validators=[MaxValueValidator(100)],
                                                   null=True,
                                                   blank=True)
    weight = models.DecimalField(default=1,
                                 validators=[MinValueValidator(0)],
                                 max_digits=3,
                                 decimal_places=1,
                                 null=True,
                                 blank=True)
    initial = models.DurationField(default=timedelta(minutes=2),
                                   null=True,
                                   blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['temperature', 'weight', 'initial'],
                                    name='unique_western')
        ]

    def __str__(self):
        """
        Returns weight, temperature, brewing time
        in standard western brewing style, ie: 1g 99°c 2m
        """
        iw = self.weight.to_integral_value()

        return str(iw if iw == self.weight else '%.1f' % self.weight) \
            + 'g ' \
            + str(self.temperature) \
            + '°c ' \
            + format_delta(self.initial)


class Origin(models.Model):
    """
    Model defining a geographic indication.
    """
    country = models.CharField(max_length=30)
    area = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ['country', 'area', 'city']
        constraints = [
            models.UniqueConstraint(fields=['country', 'area', 'city'],
                                    name='unique_origin'),
            models.UniqueConstraint(fields=['country', 'area'],
                                    condition=models.Q(city=None),
                                    name='unique_area_origin'),
            models.UniqueConstraint(fields=['country', 'city'],
                                    condition=models.Q(area=None),
                                    name='unique_city_origin')
        ]

    def __str__(self):
        origin_name = ''
        if self.city:
            origin_name += str(self.city) + ', '
        if self.area:
            origin_name += str(self.area) + ', '
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
    gongfu_brewing = models.ForeignKey(GongfuBrewing, on_delete=models.SET_NULL, null=True, blank=True)
    western_brewing = models.ForeignKey(WesternBrewing, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    name = models.CharField(max_length=50)
    translated_name = models.CharField(max_length=50, blank=True)
    origin = models.ForeignKey(Origin, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    gongfu_brewing = models.ForeignKey(GongfuBrewing, on_delete=models.SET_NULL, null=True, blank=True)
    western_brewing = models.ForeignKey(WesternBrewing, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class SubcategoryName(models.Model):
    name = models.CharField(max_length=50)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Vendor(models.Model):
    name = models.CharField(max_length=50)
    website = models.CharField(max_length=50, blank=True)
    origin = models.ForeignKey(Origin, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    popularity = models.PositiveSmallIntegerField(default=5,
                                                  validators=[MaxValueValidator(10)],
                                                  null=True,
                                                  blank=True)

    def __str__(self):
        return self.name


class VendorTrademark(models.Model):
    name = models.CharField(max_length=50)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
