from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_extra_fields.fields import Base64ImageField

from .models import (
    GongfuBrewing,
    WesternBrewing,
    Origin,
    Category,
    Subcategory,
    SubcategoryName,
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


class GongfuBrewingSerializer(serializers.ModelSerializer):
    """
    GongfuBrewing serializer returns instance if existing or creates a new one.
    """

    class Meta:
        model = GongfuBrewing
        fields = "__all__"

    def create(self, validated_data):
        instance, _ = GongfuBrewing.objects.get_or_create(**validated_data)
        return instance


class WesternBrewingSerializer(serializers.ModelSerializer):
    """
    WesternBrewing serializer returns instance if existing or creates a new one.
    """

    class Meta:
        model = WesternBrewing
        fields = "__all__"

    def create(self, validated_data):
        instance, _ = WesternBrewing.objects.get_or_create(**validated_data)
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

    gongfu_brewing = GongfuBrewingSerializer()
    western_brewing = WesternBrewingSerializer()

    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = (
            "id",
            "name",
            "gongfu_brewing",
            "western_brewing",
        )


class SubcategorySerializer(serializers.ModelSerializer):
    """
    Subcategory serializer, passes request user on creation.
    """

    user = serializers.ReadOnlyField(source="user.pk")
    gongfu_brewing = GongfuBrewingSerializer(required=False)
    western_brewing = WesternBrewingSerializer(required=False)

    class Meta:
        model = Subcategory
        fields = "__all__"
        read_only_fields = ("user",)


class SubcategoryNameSerializer(serializers.ModelSerializer):
    """
    SubcategoryName serializer.
    """

    class Meta:
        model = SubcategoryName
        fields = "__all__"


class TeaSerializer(serializers.ModelSerializer):
    """
    Tea serializer with nested brewings and origin, passes request user on creation.
    Expects image as base64.
    """

    user = serializers.ReadOnlyField(source="user.pk")
    image = Base64ImageField(required=False)
    gongfu_brewing = GongfuBrewingSerializer(required=False)
    western_brewing = WesternBrewingSerializer(required=False)
    origin = OriginSerializer(required=False)

    class Meta:
        model = Tea
        fields = "__all__"
        read_only_fields = ("user",)

    def create(self, validated_data):
        """
        Nested create, removes null origin and brewings entries and creates separate instances
        before feeding them to the tea instance.
        """
        gongfu_data, western_data, origin_data = {}, {}, {}

        if "gongfu_brewing" in validated_data:
            gongfu_data = validated_data.pop("gongfu_brewing")
            [gongfu_data.pop(k) for k, v in list(gongfu_data.items()) if v is None]

        if "western_brewing" in validated_data:
            western_data = validated_data.pop("western_brewing")
            [western_data.pop(k) for k, v in list(western_data.items()) if v is None]

        if "origin" in validated_data:
            origin_data = validated_data.pop("origin")
            origin_data["user"] = validated_data["user"]
            [origin_data.pop(k) for k, v in list(origin_data.items()) if v is None]

        tea_instance = Tea.objects.create(**validated_data)

        if gongfu_data:
            gongfu_instance, _ = GongfuBrewing.objects.get_or_create(**gongfu_data)
            tea_instance.gongfu_brewing = gongfu_instance

        if western_data:
            western_instance, _ = WesternBrewing.objects.get_or_create(**western_data)
            tea_instance.western_brewing = western_instance

        if origin_data:
            origin_instance, _ = Origin.objects.get_or_create(**origin_data)
            tea_instance.origin = origin_instance

        tea_instance.save()
        return tea_instance
