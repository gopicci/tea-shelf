from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    LoginSerializer,
    UserSerializer,
    GongfuBrewingSerializer,
    WesternBrewingSerializer,
    CategorySerializer,
    SubcategorySerializer,
    OriginSerializer,
    TeaSerializer,
)
from .models import Category, GongfuBrewing, WesternBrewing, Origin, Subcategory, Tea


class RegisterView(generics.CreateAPIView):
    """
    Register view.
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class LoginView(TokenObtainPairView):
    """
    Login view.
    """

    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)


class UserView(generics.RetrieveAPIView):
    """
    Logged in user detail view.
    """

    serializer_class = UserSerializer
    lookup_field = "pk"

    def get_object(self, *args, **kwargs):
        return self.request.user


class GongfuBrewingCreateView(generics.CreateAPIView):
    """
    Create gongfu brewing details.
    """

    serializer_class = GongfuBrewingSerializer


class GongfuBrewingDetailView(generics.RetrieveAPIView):
    """
    Retrieve gongfu brewing details.
    """

    lookup_field = "pk"
    queryset = GongfuBrewing.objects.all()
    serializer_class = GongfuBrewingSerializer


class WesternBrewingCreateView(generics.CreateAPIView):
    """
    Create western brewing details.
    """

    serializer_class = WesternBrewingSerializer


class WesternBrewingDetailView(generics.RetrieveAPIView):
    """
    Retrieve western brewing details.
    """

    lookup_field = "pk"
    queryset = WesternBrewing.objects.all()
    serializer_class = WesternBrewingSerializer


class OriginCreateView(generics.CreateAPIView):
    """
    Create origin passing current user.
    """

    serializer_class = OriginSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OriginDetailView(generics.RetrieveAPIView):
    """
    Retrieve origin details.
    """
    lookup_field = "pk"
    queryset = Origin.objects.all()
    serializer_class = OriginSerializer


class CategoryView(generics.ListAPIView):
    """
    List categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubcategoryView(generics.ListCreateAPIView):
    """
    List and create subcategories.
    """
    serializer_class = SubcategorySerializer

    def get_queryset(self):
        """
        Lists only user owned and pre-saved subcategories.
        """
        return Subcategory.objects.filter(Q(user=self.request.user) | Q(user=1))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TeaViewSet(viewsets.ModelViewSet):
    """
    Tea view set.
    """
    lookup_field = "id"
    serializer_class = TeaSerializer

    def get_queryset(self):
        """
        Allow access only to user instances.
        """
        return Tea.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
