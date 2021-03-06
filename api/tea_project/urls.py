"""tea_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from catalog.views import (
    BrewingCreateView,
    BrewingDetailView,
    BrewingSessionViewSet,
    CategoryView,
    LoginView,
    OriginCreateView,
    OriginDetailView,
    PlacesAutocompleteView,
    PlacesDetailsView,
    RegisterView,
    SubcategoryView,
    TeaViewSet,
    UpdatePasswordView,
    UserView,
    VendorView,
    VisionParserView,
)

from .views import ping

router = routers.SimpleRouter()
router.register(r"tea", TeaViewSet, basename="tea")
router.register(r"brewing_session", BrewingSessionViewSet, basename="brewing_session")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("ping/", ping, name="ping"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/password_update/", UpdatePasswordView.as_view(), name="password_update"),
    path(
        "api/password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("api/user/", UserView.as_view(), name="user_detail"),
    path("api/brewing/", BrewingCreateView.as_view(), name="brewing_create",),
    path("api/brewing/<int:pk>/", BrewingDetailView.as_view(), name="brewing_detail",),
    path("api/origin/", OriginCreateView.as_view(), name="origin_create"),
    path("api/origin/<int:pk>/", OriginDetailView.as_view(), name="origin_detail"),
    path("api/category/", CategoryView.as_view(), name="category_list"),
    path("api/subcategory/", SubcategoryView.as_view(), name="subcategory_list_create"),
    path("api/vendor/", VendorView.as_view(), name="vendor_list_create"),
    path("api/", include(router.urls)),
    path("api/parser/", VisionParserView.as_view(), name="parser"),
    path(
        "api/places/autocomplete/",
        PlacesAutocompleteView.as_view(),
        name="places_autocomplete",
    ),
    path("api/places/details/", PlacesDetailsView.as_view(), name="places_details"),
]
