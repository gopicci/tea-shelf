from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LoginSerializer, UserSerializer


class RegisterView(CreateAPIView):
    """
    Register view
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class LoginView(TokenObtainPairView):
    """
    Login view.
    """

    serializer_class = LoginSerializer


class UserView(RetrieveAPIView):
    """
    Logged in user detail view.
    """

    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = "pk"

    def get_object(self, *args, **kwargs):
        return self.request.user
