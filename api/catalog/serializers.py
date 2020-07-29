from datetime import timedelta

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_extra_fields.fields import Base64ImageField

from .models import (
    Brewing,
    Origin,
    Category,
    Subcategory,
    SubcategoryName,
    Vendor,
    Tea,
)
from .validators import validate_username


class UserSerializer(serializers.ModelSerializer):
    """
    Custom user serializer, validates that both password match on creation.
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

    @staticmethod
    def validate_email(value):
        return validate_username(value)

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        data = {
            key: value
            for key, value in validated_data.items()
            if key not in ("password1", "password2")
        }
        data["password"] = validated_data["password1"]
        user = self.Meta.model.objects.create_user(**data)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    """
    JWT login serializer, returns refresh and access tokens.
    """

    email = serializers.EmailField()
    password = serializers.CharField()

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for key, value in user_data.items():
            if key != "id":
                token[key] = value
        return token

    def validate(self, attrs):
        user = authenticate(username=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Incorrect email or password.")
            return None

        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data


class BrewingSerializer(serializers.ModelSerializer):
    """
    Brewing serializer returns instance if existing or creates a new one.
    """

    class Meta:
        model = Brewing
        fields = "__all__"

    def create(self, validated_data):
        if not validated_data["temperature"]:
            validated_data["temperature"] = 0
        if not validated_data["weight"]:
            validated_data["weight"] = 0
        if not validated_data["initial"]:
            validated_data["initial"] = timedelta(seconds=0)
        if not validated_data["increments"]:
            validated_data["increments"] = timedelta(seconds=0)

        instance, _ = Brewing.objects.get_or_create(**validated_data)

        return instance


class OriginSerializer(serializers.ModelSerializer):
    """
    Origin serializer, passes request user on creation.
    """

    user = serializers.ReadOnlyField(source="user.pk")

    class Meta:
        model = Origin
        fields = "__all__"
        read_only_fields = ("user",)

    def create(self, validated_data):
        """
        Checks if public origin exists or user already has it.
        """
        query_data = {"country": validated_data["country"], "is_public": True}
        if "region" in validated_data:
            query_data["region"] = validated_data["region"]
        if "locality" in validated_data:
            query_data["locality"] = validated_data["locality"]

        try:
            instance = Origin.objects.get(**query_data)
        except Origin.DoesNotExist:
            try:
                query_data["is_public"] = False
                query_data["user"] = validated_data["user"]
                instance = Origin.objects.get(**query_data)
            except Origin.DoesNotExist:
                instance = None

        if not instance:
            instance = Origin(**validated_data)
            instance.save()

        return instance


class CategorySerializer(serializers.ModelSerializer):
    """
    Category serializer with nested brewings.
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

    try:
        instance = model.objects.get(**query_data)
    except model.DoesNotExist:
        try:
            query_data["is_public"] = False
            query_data["user"] = validated_data["user"]
            instance = model.objects.get(**query_data)
        except model.DoesNotExist:
            instance = None

    if not instance:
        instance = model(**validated_data)
        instance.save()

    return instance


class SubcategorySerializer(serializers.ModelSerializer):
    """
    Subcategory serializer, passes request user on creation.
    """

    user = serializers.ReadOnlyField(source="user.pk")
    gongfu_brewing = BrewingSerializer(required=False, allow_null=True)
    western_brewing = BrewingSerializer(required=False, allow_null=True)

    class Meta:
        model = Subcategory
        fields = "__all__"
        read_only_fields = ("user",)

    def create(self, validated_data):
        return custom_get_or_create(Subcategory, validated_data)


class SubcategoryNameSerializer(serializers.ModelSerializer):
    """
    SubcategoryName serializer.
    """

    class Meta:
        model = SubcategoryName
        fields = "__all__"


class VendorSerializer(serializers.ModelSerializer):
    """
    Vendor serializer, passes request user on creation.
    """

    user = serializers.ReadOnlyField(source="user.pk")

    class Meta:
        model = Vendor
        fields = "__all__"
        read_only_fields = ("user",)

    def create(self, validated_data):
        return custom_get_or_create(Vendor, validated_data)


class TeaSerializer(serializers.ModelSerializer):
    """
    Tea serializer with nested brewings, origin and vendor,
    passes request user on creation. Expects image as base64.
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

    def extract_nested_fields(self, validated_data):
        nested_data = {}

        if "gongfu_brewing" in validated_data:
            nested_data["gongfu"] = validated_data.pop("gongfu_brewing")
            if nested_data["gongfu"]:
                [
                    nested_data["gongfu"].pop(k)
                    for k, v in list(nested_data["gongfu"].items())
                    if v is None
                ]

        if "western_brewing" in validated_data:
            nested_data["western"] = validated_data.pop("western_brewing")
            if nested_data["western"]:
                for k, v in list(nested_data["western"].items()):
                    if v is None:
                        nested_data["western"].pop(k)

        if "origin" in validated_data:
            nested_data["origin"] = validated_data.pop("origin")
            if nested_data["origin"]:
                nested_data["origin"]["user"] = validated_data["user"]
                [
                    nested_data["origin"].pop(k)
                    for k, v in list(nested_data["origin"].items())
                    if v is None
                ]

        if "subcategory" in validated_data:
            nested_data["subcategory"] = validated_data.pop("subcategory")
            if nested_data["subcategory"]:
                nested_data["subcategory"]["user"] = validated_data["user"]
                for k, v in list(nested_data["subcategory"].items()):
                    if v is None:
                        nested_data["subcategory"].pop(k)

        if "vendor" in validated_data:
            nested_data["vendor"] = validated_data.pop("vendor")
            if nested_data["vendor"]:
                nested_data["vendor"]["user"] = validated_data["user"]
                for k, v in list(nested_data["vendor"].items()):
                    if v is None:
                        nested_data["vendor"].pop(k)

        return validated_data, nested_data

    def assign_nested_data(self, instance, nested_data):
        if "gongfu" in nested_data:
            gongfu_instance, _ = Brewing.objects.get_or_create(**nested_data["gongfu"])
            instance.gongfu_brewing = gongfu_instance

        if "western" in nested_data:
            western_instance, _ = Brewing.objects.get_or_create(
                **nested_data["western"]
            )
            instance.western_brewing = western_instance

        if "origin" in nested_data:
            origin_instance, _ = Origin.objects.get_or_create(**nested_data["origin"])
            instance.origin = origin_instance

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
        unnested_data, nested_data = self.extract_nested_fields(validated_data)

        for k, v in unnested_data.items():
            setattr(instance, k, v)

        return self.assign_nested_data(instance, nested_data)
