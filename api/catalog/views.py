from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LoginSerializer, UserSerializer, GongfuBrewingSerializer, WesternBrewingSerializer, \
    CategorySerializer, SubcategorySerializer, OriginSerializer
from .models import Category, GongfuBrewing, WesternBrewing, Origin


class RegisterView(generics.CreateAPIView):
    """
    Register view.
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny, )


class LoginView(TokenObtainPairView):
    """
    Login view.
    """

    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny, )


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
    Create gongfu brewing details
    """
    serializer_class = GongfuBrewingSerializer


class GongfuBrewingDetailView(generics.RetrieveAPIView):
    """
    Retrieve gongfu brewing details
    """
    lookup_field = 'pk'
    queryset = GongfuBrewing.objects.all()
    serializer_class = GongfuBrewingSerializer


class WesternBrewingCreateView(generics.CreateAPIView):
    """
    Create western brewing details
    """
    serializer_class = WesternBrewingSerializer


class WesternBrewingDetailView(generics.RetrieveAPIView):
    """
    Retrieve western brewing details
    """
    lookup_field = 'pk'
    queryset = WesternBrewing.objects.all()
    serializer_class = WesternBrewingSerializer


class OriginCreateView(generics.CreateAPIView):
    serializer_class = OriginSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OriginDetailView(generics.RetrieveAPIView):
    lookup_field = 'pk'
    queryset = Origin.objects.all()
    serializer_class = OriginSerializer


class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubcategoryView(generics.ListCreateAPIView):
    serializer_class = SubcategorySerializer
