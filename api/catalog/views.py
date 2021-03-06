import googlemaps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Brewing, BrewingSession, Category, Origin, Subcategory, Tea, Vendor
from .serializers import (
    BrewingSerializer,
    BrewingSessionSerializer,
    CategorySerializer,
    LoginSerializer,
    OriginSerializer,
    SubcategorySerializer,
    TeaSerializer,
    UserSerializer,
    VendorSerializer,
)
from .vision_parser import VisionParser


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
    Authenticated user detail view.
    """

    serializer_class = UserSerializer
    lookup_field = "pk"

    def get_object(self, *args, **kwargs):
        """ Gets current user from request. """
        return self.request.user


class UpdatePasswordView(UpdateAPIView):
    """
    Authenticated user password update view.
    """

    serializer_class = UserSerializer
    lookup_field = "pk"

    def get_object(self, *args, **kwargs):
        """ Gets current user from request. """
        return self.request.user


@receiver(reset_password_token_created)
def password_reset_token_created(sender, reset_password_token, *args, **kwargs):
    """
    Unauthenticated user password reset token handler.
    When a token is created, an e-mail is sent to the user.

    Args:
        sender: View Class that sent the signal.
        reset_password_token: Token Model object in {user, key} format.
    """

    context = {
        "email": reset_password_token.user.email,
        "reset_password_url": f"{settings.BASE_URL}/?reset_token={reset_password_token.key}",
    }

    email_html_message = render_to_string("user_reset_password.txt", context)
    email_plaintext_message = render_to_string("user_reset_password.txt", context)

    msg = EmailMultiAlternatives(
        f"Password Reset for {settings.DOMAIN}",
        email_plaintext_message,
        f"noreply@{settings.DOMAIN}",
        [reset_password_token.user.email],
    )
    msg.attach_alternative(email_html_message, "text/txt")
    msg.send()


class BrewingCreateView(CreateAPIView):
    """
    Create brewing details view.
    """

    serializer_class = BrewingSerializer


class BrewingDetailView(RetrieveAPIView):
    """
    Retrieve brewing details view.
    """

    lookup_field = "pk"
    queryset = Brewing.objects.all()
    serializer_class = BrewingSerializer


class OriginCreateView(CreateAPIView):
    """
    Create origin view.
    """

    serializer_class = OriginSerializer

    def perform_create(self, serializer):
        """ Passes current user to serializer. """
        serializer.save(user=self.request.user)


class OriginDetailView(RetrieveAPIView):
    """
    Retrieve origin details view.
    """

    lookup_field = "pk"
    queryset = Origin.objects.all()
    serializer_class = OriginSerializer


class CategoryView(ListAPIView):
    """
    List categories view.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubcategoryView(ListCreateAPIView):
    """
    List and create subcategories view.
    """

    serializer_class = SubcategorySerializer

    def get_queryset(self):
        """ Lists only user owned and public subcategories. """
        return Subcategory.objects.filter(Q(user=self.request.user) | Q(is_public=True))

    def perform_create(self, serializer):
        """ Passes current user to serializer on create. """
        serializer.save(user=self.request.user)


class VendorView(ListCreateAPIView):
    """
    List and create vendors view.
    """

    serializer_class = VendorSerializer

    def get_queryset(self):
        """ Lists only user owned and public subcategories. """
        return Vendor.objects.filter(Q(user=self.request.user) | Q(is_public=True))

    def perform_create(self, serializer):
        """ Passes current user to serializer on create. """
        serializer.save(user=self.request.user)


class TeaViewSet(ModelViewSet):
    """
    Tea view set.
    """

    lookup_field = "id"
    serializer_class = TeaSerializer
    http_method_names = ["get", "post", "head", "put", "delete", "options"]

    def get_queryset(self):
        """ Allows access only to user instances. """
        return Tea.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """ Passes current user to serializer on create. """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """ Passes current user to serializer on update. """
        serializer.save(user=self.request.user)


class VisionParserView(APIView):
    """
    Extract tea data view.
    """

    def post(self, request):
        """
        On post runs base64 image data through vision parser to extract tea info.

        Args:
            request: Request data, expects an image field as a base64 image data string

        Returns:
            Response object with extracted tea data or error info.
        """
        try:
            image_data = request.data["image"].split(",")[1]
            if not image_data:
                raise ValueError
            parser = VisionParser(image_data)
            tea_data = parser.get_tea_data(max_name_length=50)
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
    Wrapper view around Places API autocomplete. Groups requests
    on the same session based on token.
    """

    def post(self, request):
        """
        On post runs input and token through Places autocomplete.

        Args:
            request: Request data containing an input field with the
                string to look up and a token field with the token
                string for the grouping.
        Returns:
            Response object with the regions results or error info.
        """
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
    Wrapper view around Places API details. Groups requests
    on the same session based on token.
    """

    def post(self, request):
        """
        On post runs place_id and token through Places details.

        Args:
            request: Request data containing a place_id field with the
                ID string of the place to look up and a token field
                with the token string for the grouping.
        Returns:
            Response object with results data containing adr_address and
            geometry or error info.
        """
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


class BrewingSessionViewSet(ModelViewSet):
    """
    Brewing session view set.
    """

    lookup_field = "id"
    serializer_class = BrewingSessionSerializer
    http_method_names = ["get", "post", "head", "put", "delete", "options"]

    def get_queryset(self):
        """ Allows access only to user instances. """
        return BrewingSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """ Passes current user to serializer on create. """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """ Passes current user to serializer on update. """
        serializer.save(user=self.request.user)
