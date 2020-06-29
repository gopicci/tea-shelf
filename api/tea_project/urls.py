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
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import ping
from catalog.views import RegisterView, LoginView, UserView, GongfuBrewingCreateView, GongfuBrewingDetailView, \
    WesternBrewingCreateView, WesternBrewingDetailView, OriginDetailView, CategoryView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("ping/", ping, name="ping"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/user/", UserView.as_view(), name="user"),
    path("api/brewings/gongfu/", GongfuBrewingCreateView.as_view(), name="gongfu_brewing_create"),
    path("api/brewings/gongfu/<int:pk>/", GongfuBrewingDetailView.as_view(), name="gongfu_brewing_detail"),
    path("api/brewings/western/", WesternBrewingCreateView.as_view(), name="western_brewing_create"),
    path("api/brewings/western/<int:pk>/", WesternBrewingDetailView.as_view(), name="western_brewing_detail"),
    path("api/origin/<int:pk>/", OriginDetailView.as_view(), name="origin_detail"),
    path("api/categories/", CategoryView.as_view(), name="categories"),
]
