from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import (
    get_password_validators,
    validate_password,
)
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Brewing, BrewingSession, Category, Origin, Subcategory, Tea, Vendor


class UserSerializer(serializers.ModelSerializer):
    """
    Custom user serializer, validates that both passwords match on creation.
    """

    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "last_login",
            "email",
            "is_active",
            "joined_at",
            "password1",
            "password2",
        )
        read_only_fields = ("id", "last_login", "is_active", "joined_at")
        extra_kwargs = {
            "password1": {"required": True, "write_only": True},
            "password2": {"required": True, "write_only": True},
        }

    def validate(self, data):
        """
        Checks that both passwords match and satisfy AUTH_PASSWORD_VALIDATORS.
        """
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords must match.")
        validate_password(
            data["password1"],
            password_validators=get_password_validators(
                settings.AUTH_PASSWORD_VALIDATORS
            ),
        )
        return data

    def create(self, validated_data):
        """
        Drops extra password on create.
        """
        data = {
            key: value
            for key, value in validated_data.items()
            if key not in ("password1", "password2")
        }
        data["password"] = validated_data["password1"]
        user = self.Meta.model.objects.create_user(**data)
        return user

    def update(self, instance, validated_data):
        """
        Updates user password.
        """
        instance.set_password(validated_data["password1"])
        instance.save()
        return instance


class LoginSerializer(TokenObtainPairSerializer):
    """
    JWT login serializer, returns refresh and access tokens.
    """

    email = serializers.EmailField()
    password = serializers.CharField()

    @classmethod
    def get_token(cls, user):
        """
        Adds user data to token.
        """
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for key, value in user_data.items():
            if key != "id":
                token[key] = value
        return token

    def validate(self, attrs):
        """
        Checks user authentication and returns a new pair of tokens.
        """
        user = authenticate(username=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Incorrect email or password.")

        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data


def get_or_create_brewing(validated_data):
    """
    Sets defaults for missing input values then returns instance if existing
    or creates a new one.
    """
    if "temperature" not in validated_data or not validated_data["temperature"]:
        validated_data["temperature"] = 0
    if "weight" not in validated_data or not validated_data["weight"]:
        validated_data["weight"] = 0
    if "initial" not in validated_data or not validated_data["initial"]:
        validated_data["initial"] = timedelta(seconds=0)
    if "increments" not in validated_data or not validated_data["increments"]:
        validated_data["increments"] = timedelta(seconds=0)

    instance, _ = Brewing.objects.get_or_create(**validated_data)

    return instance


class BrewingSerializer(serializers.ModelSerializer):
    """
    Brewing model serializer.
    """

    class Meta:
        model = Brewing
        fields = "__all__"

    def create(self, validated_data):
        """
        Sets defaults for missing input values then returns instance if existing
        or creates a new one.
        """
        return get_or_create_brewing(validated_data)


def get_or_create_origin(validated_data):
    """
    Checks if public origin instance exists or user already has it.
    Updates instance with latitude and longitude if missing.
    """
    query_data = {"country": validated_data["country"], "is_public": True}
    if "region" in validated_data:
        query_data["region"] = validated_data["region"]
    else:
        query_data["region"] = ""
    if "locality" in validated_data:
        query_data["locality"] = validated_data["locality"]
    else:
        query_data["locality"] = ""

    try:  # Get existing public
        instance = Origin.objects.get(**query_data)
    except Origin.DoesNotExist:
        try:  # Get existing user owned
            query_data["is_public"] = False
            query_data["user"] = validated_data["user"]
            instance = Origin.objects.get(**query_data)
        except Origin.DoesNotExist:
            instance = None

    if not instance:  # Create new
        instance = Origin(**validated_data)

    # Add latitude and longitude if any as instance might be missing them
    if "latitude" in validated_data and not instance.latitude:
        instance.latitude = validated_data["latitude"]

    if "longitude" in validated_data and not instance.longitude:
        instance.longitude = validated_data["longitude"]

    instance.save()

    return instance


class OriginSerializer(serializers.ModelSerializer):
    """
    Origin model serializer, user based.
    """

    user = serializers.ReadOnlyField(source="user.pk")

    class Meta:
        model = Origin
        fields = "__all__"
        read_only_fields = (
            "user",
            "is_public",
        )

    def create(self, validated_data):
        """ Returns existing origin or creates a new one. """
        return get_or_create_origin(validated_data)


class CategorySerializer(serializers.ModelSerializer):
    """
    Category model serializer with nested brewings.
    """

    gongfu_brewing = BrewingSerializer()
    western_brewing = BrewingSerializer()

    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = (
            "id",
            "name",
            "gongfu_brewing",
            "western_brewing",
        )


def custom_get_or_create(model, validated_data):
    """
    Checks if public model instance with same name exists or user already has it.
    """
    query_data = {"name": validated_data["name"], "is_public": True}

    try:  # Get public instance
        instance = model.objects.get(**query_data)
    except model.DoesNotExist:
        try:  # Get user owned instance
            query_data["is_public"] = False
            query_data["user"] = validated_data["user"]
            instance = model.objects.get(**query_data)
        except model.DoesNotExist:
            instance = None

    if not instance:  # Create new
        instance = model(**validated_data)
        instance.save()

    return instance


class SubcategorySerializer(serializers.ModelSerializer):
    """
    Subcategory model serializer. User based with nested
    brewings and origin.
    """

    user = serializers.ReadOnlyField(source="user.pk")
    gongfu_brewing = BrewingSerializer(required=False, allow_null=True)
    western_brewing = BrewingSerializer(required=False, allow_null=True)
    origin = OriginSerializer(required=False, allow_null=True)

    class Meta:
        model = Subcategory
        fields = "__all__"
        read_only_fields = (
            "user",
            "is_public",
        )

    def create(self, validated_data):
        """ Returns existing subcategory or creates a new one. """
        return custom_get_or_create(Subcategory, validated_data)


class VendorSerializer(serializers.ModelSerializer):
    """
    Vendor serializer, user based.
    """

    user = serializers.ReadOnlyField(source="user.pk")

    class Meta:
        model = Vendor
        fields = "__all__"
        read_only_fields = (
            "user",
            "is_public",
        )

    def create(self, validated_data):
        """ Returns existing vendor or creates a new one. """
        return custom_get_or_create(Vendor, validated_data)


class TeaSerializer(serializers.ModelSerializer):
    """
    Tea serializer. User based with nested brewings, origin, subcategory
    and vendor. Expects image data as base64.
    """

    user = serializers.ReadOnlyField(source="user.pk")
    image = Base64ImageField(required=False, allow_null=True)
    gongfu_brewing = BrewingSerializer(required=False, allow_null=True)
    western_brewing = BrewingSerializer(required=False, allow_null=True)
    origin = OriginSerializer(required=False, allow_null=True)
    subcategory = SubcategorySerializer(required=False, allow_null=True)
    vendor = VendorSerializer(required=False, allow_null=True)

    class Meta:
        model = Tea
        fields = "__all__"
        read_only_fields = ("user",)

    def to_representation(self, instance):
        """ Returns image relative path. """
        response = super(TeaSerializer, self).to_representation(instance)
        if instance.image:
            response["image"] = instance.image.url
        return response

    def extract_nested_fields(self, validated_data):
        """
        Extracts nested fields from validated data and removes null entries.

        Args:
            validated_data: Request validated data.

        Returns:
            Tuple with validated data cleaned of nested entries and dictionary
            containing nested objects.
        """
        nested_data = {}

        if (
            "gongfu_brewing" in validated_data
            and validated_data["gongfu_brewing"] is not None
        ):
            nested_data["gongfu"] = validated_data.pop("gongfu_brewing")
            if nested_data["gongfu"]:
                for k, v in list(nested_data["gongfu"].items()):
                    if v is None:
                        nested_data["gongfu"].pop(k)

        if (
            "western_brewing" in validated_data
            and validated_data["western_brewing"] is not None
        ):
            nested_data["western"] = validated_data.pop("western_brewing")
            if nested_data["western"]:
                for k, v in list(nested_data["western"].items()):
                    if v is None:
                        nested_data["western"].pop(k)

        if "origin" in validated_data and validated_data["origin"] is not None:
            nested_data["origin"] = validated_data.pop("origin")
            if nested_data["origin"]:
                nested_data["origin"]["user"] = validated_data["user"]
                for k, v in list(nested_data["origin"].items()):
                    if v is None:
                        nested_data["origin"].pop(k)

        if (
            "subcategory" in validated_data
            and validated_data["subcategory"] is not None
        ):
            nested_data["subcategory"] = validated_data.pop("subcategory")
            if nested_data["subcategory"]:
                nested_data["subcategory"]["user"] = validated_data["user"]
                for k, v in list(nested_data["subcategory"].items()):
                    if v is None:
                        nested_data["subcategory"].pop(k)

        if "vendor" in validated_data and validated_data["vendor"] is not None:
            nested_data["vendor"] = validated_data.pop("vendor")
            if nested_data["vendor"]:
                nested_data["vendor"]["user"] = validated_data["user"]
                for k, v in list(nested_data["vendor"].items()):
                    if v is None:
                        nested_data["vendor"].pop(k)

        return validated_data, nested_data

    def assign_nested_data(self, instance, nested_data):
        """
        Creates separate instances for nested fields and assigns them
        to the provided tea instance.

        Args:
            instance: Tea instance.
            nested_data: Dictionary containing nested objects.
        Returns:
            Saved tea instance with nested objects.
        """
        if "gongfu" in nested_data:
            instance.gongfu_brewing = get_or_create_brewing(nested_data["gongfu"])

        if "western" in nested_data:
            instance.western_brewing = get_or_create_brewing(nested_data["western"])

        if "origin" in nested_data:
            instance.origin = get_or_create_origin(nested_data["origin"])

        if "subcategory" in nested_data:
            instance.subcategory = custom_get_or_create(
                Subcategory, nested_data["subcategory"]
            )

        if "vendor" in nested_data:
            instance.vendor = custom_get_or_create(Vendor, nested_data["vendor"])

        instance.save()
        return instance

    def create(self, validated_data):
        """
        Nested create, removes null nested entries and creates separate instances
        before feeding them to the tea instance.
        """
        unnested_data, nested_data = self.extract_nested_fields(validated_data)

        instance = Tea.objects.create(**unnested_data)

        return self.assign_nested_data(instance, nested_data)

    def update(self, instance, validated_data):
        """
        Nested update, removes null nested entries and creates separate instances
        before feeding them to the tea instance.
        """
        unnested_data, nested_data = self.extract_nested_fields(validated_data)

        for k, v in unnested_data.items():
            setattr(instance, k, v)

        return self.assign_nested_data(instance, nested_data)


class BrewingSessionSerializer(serializers.ModelSerializer):
    """
    BrewingSession serializer. User based with nested brewing.
    """

    user = serializers.ReadOnlyField(source="user.pk")
    brewing = BrewingSerializer(required=False, allow_null=True)

    class Meta:
        model = BrewingSession
        fields = "__all__"
        read_only_fields = ("user",)

    def create(self, validated_data):
        """
        Nested create, removes null brewing entries and creates a brewing instance
        before feeding it to the tea instance.
        """
        brewing = {}

        if "brewing" in validated_data and validated_data["brewing"] is not None:
            brewing = validated_data.pop("brewing")

        instance = BrewingSession.objects.create(**validated_data)

        if brewing:
            instance.brewing = get_or_create_brewing(brewing)

        instance.save()
        return instance

    def update(self, instance, validated_data):
        """
        Nested update, removes null brewing entries and creates a brewing instance
        before feeding it to the tea instance.
        """
        brewing = {}

        if "brewing" in validated_data and validated_data["brewing"] is not None:
            brewing = validated_data.pop("brewing")

        for k, v in validated_data.items():
            setattr(instance, k, v)

        if brewing:
            instance.brewing = get_or_create_brewing(brewing)

        instance.save()
        return instance
