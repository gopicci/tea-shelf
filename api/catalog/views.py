from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
import googlemaps
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    ListAPIView,
    ListCreateAPIView,
)
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .vision_parser import VisionParser

from .serializers import (
    LoginSerializer,
    UserSerializer,
    BrewingSerializer,
    CategorySerializer,
    SubcategorySerializer,
    VendorSerializer,
    OriginSerializer,
    TeaSerializer,
)
from .models import (
    Category,
    Brewing,
    Origin,
    Subcategory,
    Vendor,
    Tea,
)


class RegisterView(CreateAPIView):
    """
    Register view.
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class LoginView(TokenObtainPairView):
    """
    Login view.
    """

    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)


class UserView(RetrieveAPIView):
    """
    Logged in user detail view.
    """

    serializer_class = UserSerializer
    lookup_field = "pk"

    def get_object(self, *args, **kwargs):
        return self.request.user


class BrewingCreateView(CreateAPIView):
    """
    Create gongfu brewing details.
    """

    serializer_class = BrewingSerializer


class BrewingDetailView(RetrieveAPIView):
    """
    Retrieve gongfu brewing details.
    """

    lookup_field = "pk"
    queryset = Brewing.objects.all()
    serializer_class = BrewingSerializer


class OriginCreateView(CreateAPIView):
    """
    Create origin passing current user.
    """

    serializer_class = OriginSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OriginDetailView(RetrieveAPIView):
    """
    Retrieve origin details.
    """

    lookup_field = "pk"
    queryset = Origin.objects.all()
    serializer_class = OriginSerializer


class CategoryView(ListAPIView):
    """
    List categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubcategoryView(ListCreateAPIView):
    """
    List and create subcategories.
    """

    serializer_class = SubcategorySerializer

    def get_queryset(self):
        """
        Lists only user owned and pre-saved subcategories.
        """
        return Subcategory.objects.filter(Q(user=self.request.user) | Q(is_public=True))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class VendorView(ListCreateAPIView):
    """
    List and create vendors.
    """

    serializer_class = VendorSerializer

    def get_queryset(self):
        """
        Lists only user owned and pre-saved subcategories.
        """
        return Vendor.objects.filter(Q(user=self.request.user) | Q(is_public=True))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TeaViewSet(ModelViewSet):
    """
    Tea view set.
    """

    lookup_field = "id"
    serializer_class = TeaSerializer
    http_method_names = ["get", "post", "head", "put", "delete", "options"]

    def get_queryset(self):
        """
        Allow access only to user instances.
        """
        return Tea.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class VisionParserView(APIView):
    """
    Get tea data from vision parser
    """

    def post(self, request):
        try:
            image_data = request.data["image"].split(",")[1]
            if not image_data:
                raise ValueError
            parser = VisionParser(image_data)
            tea_data = parser.get_tea_data()
            return Response(tea_data)
        except (ValueError, IndexError):
            return Response(
                data={"image": "Invalid image data"}, status=status.HTTP_400_BAD_REQUEST
            )
        except KeyError as e:
            key = str(e).strip("'")
            return Response(
                data={key: f"Missing {key} field"}, status=status.HTTP_400_BAD_REQUEST
            )


class PlacesAutocompleteView(APIView):
    """
    Wrapper view around Places API autocomplete
    """

    def post(self, request):
        try:
            gmaps = googlemaps.Client(key=settings.MAPS_API_KEY)
            results = gmaps.places_autocomplete(
                request.data["input"],
                session_token=request.data["token"],
                types=["(regions)"],
            )
            return Response(results)
        except googlemaps.exceptions.ApiError as e:
            return Response(
                data={"no_field_error": str(e).strip("'")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except KeyError as e:
            key = str(e).strip("'")
            return Response(
                data={key: f"Missing {key} field"}, status=status.HTTP_400_BAD_REQUEST
            )


class PlacesDetailsView(APIView):
    """
    Wrapper view around Places API details
    """

    def post(self, request):
        try:
            gmaps = googlemaps.Client(key=settings.MAPS_API_KEY)
            results = gmaps.place(
                request.data["place_id"],
                session_token=request.data["token"],
                fields=["adr_address", "geometry"],
            )
            return Response(results)
        except googlemaps.exceptions.ApiError as e:
            return Response(
                data={"no_field_error": str(e).strip("'")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except KeyError as e:
            key = str(e).strip("'")
            return Response(
                data={key: f"Missing {key} field"}, status=status.HTTP_400_BAD_REQUEST
            )
