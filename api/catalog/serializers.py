from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    GongfuBrewing,
    WesternBrewing,
    Origin,
    Category,
    Subcategory,
    SubcategoryName,
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
            "username",
            "is_active",
            "joined_at",
            "password1",
            "password2",
        )
        read_only_fields = ("id", "last_login", "is_active", "joined_at")
        extra_kwargs = {
            "password1": {"required": True, "write_only": True},
            "password2": {"required": True, "write_only": True},
            "username": {"required": True},
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
    class Meta:
        model = GongfuBrewing
        fields = "__all__"

    def create(self, validated_data):
        instance, _ = GongfuBrewing.objects.get_or_create(**validated_data)
        return instance


class WesternBrewingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WesternBrewing
        fields = "__all__"

    def create(self, validated_data):
        instance, _ = WesternBrewing.objects.get_or_create(**validated_data)
        return instance


class OriginSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.pk")

    class Meta:
        model = Origin
        fields = "__all__"
        read_only_fields = ("user",)


class CategorySerializer(serializers.ModelSerializer):
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
    user = serializers.ReadOnlyField(source="user.pk")

    class Meta:
        model = Subcategory
        fields = "__all__"
        read_only_fields = ("user",)


class SubcategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubcategoryName
        fields = "__all__"
