from django.contrib import admin
from django.forms import ModelForm
from django.urls import reverse
from django.utils.html import format_html

from .models import (
    CustomUser,
    GongfuBrewing,
    WesternBrewing,
    Category,
    Subcategory,
    SubcategoryName,
    Vendor,
    VendorTrademark,
    Origin,
    Tea,
)


def make_public(modeladmin, request, queryset):
    """
    Defines list action to publish instances.
    """
    queryset.update(is_public=True)


make_public.short_description = "Mark selected as public"


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    """
    Registering CustomUser model.
    """

    list_display = (
        "email",
        "username",
        "joined_at",
        "is_staff",
        "is_active",
    )
    search_fields = (
        "email",
        "username",
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Registering Category model.
    """

    list_display = (
        "name",
        "gongfu_brewing",
        "western_brewing",
    )


class GongfuBrewingForm(ModelForm):
    """
    Custom GongfuBrewing form returns instance on save if existing.
    """

    def clean(self):
        pass

    def save_m2m(self):
        instance, _ = GongfuBrewing.objects.get_or_create(**self.cleaned_data)
        return instance

    def save(self, commit=True):
        instance, _ = GongfuBrewing.objects.get_or_create(**self.cleaned_data)
        return instance


@admin.register(GongfuBrewing)
class GongfuBrewingAdmin(admin.ModelAdmin):
    """
    Registering GongfuBrewing model.
    """

    list_display = (
        "__str__",
        "temperature",
        "weight",
        "initial",
        "increments",
    )
    list_editable = (
        "temperature",
        "weight",
        "initial",
        "increments",
    )
    form = GongfuBrewingForm


class WesternBrewingForm(ModelForm):
    """
    Custom WesternBrewing form returns instance on save if existing.
    """

    def clean(self):
        pass

    def save_m2m(self):
        instance, _ = WesternBrewing.objects.get_or_create(**self.cleaned_data)
        return instance

    def save(self, commit=True):
        instance, _ = WesternBrewing.objects.get_or_create(**self.cleaned_data)
        return instance


@admin.register(WesternBrewing)
class WesternBrewingAdmin(admin.ModelAdmin):
    """
    Registering WesternBrewing model.
    """

    list_display = (
        "__str__",
        "temperature",
        "weight",
        "initial",
    )
    list_editable = (
        "temperature",
        "weight",
        "initial",
    )
    form = WesternBrewingForm


class OriginForm(ModelForm):
    """
    Custom Origin form returns instance on save if existing.
    """

    def clean(self):
        pass

    def save_m2m(self):
        instance, _ = Origin.objects.get_or_create(**self.cleaned_data)
        return instance

    def save(self, commit=True):
        instance, _ = Origin.objects.get_or_create(**self.cleaned_data)
        return instance


@admin.register(Origin)
class OriginAdmin(admin.ModelAdmin):
    """
    Registering Origin model.
    """

    list_display = (
        "country",
        "region",
        "locality",
        "user",
        "is_public",
    )
    list_filter = (
        "country",
        "region",
        "locality",
        "user",
        "is_public",
    )
    actions = [make_public]
    form = OriginForm

    def get_changeform_initial_data(self, request):
        """
        Setting current user and published as default.
        """
        get_data = super(OriginAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        get_data["is_public"] = True
        return get_data


class SubcategoryNameInline(admin.TabularInline):
    """
    Defining SubcategoryName model as Subcategory tabular inline.
    """

    model = SubcategoryName
    extra = 0


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    """
    Registering Subcategory model.
    """

    list_display = (
        "__str__",
        "category",
        "origin",
        "gongfu_brewing",
        "western_brewing",
        "user",
        "is_public",
    )
    list_filter = (
        "category",
        "origin__country",
        "origin__region",
        "origin__locality",
        "user",
        "is_public",
    )
    search_fields = (
        "name",
        "translated_name",
    )
    inlines = [SubcategoryNameInline]
    actions = [make_public]

    def get_changeform_initial_data(self, request):
        """
        Setting current user and published as default.
        """
        get_data = super(SubcategoryAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        get_data["is_public"] = True
        return get_data


class VendorNameInline(admin.TabularInline):
    """
    Defining VendorName model as Vendor tabular inline.
    """

    model = VendorTrademark
    extra = 0


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    """
    Registering Vendor model.
    """

    list_display = (
        "name",
        "origin",
        "website",
        "popularity",
        "user",
        "is_public",
    )
    list_filter = (
        "origin__country",
        "origin__region",
        "origin__locality",
        "user",
        "is_public",
    )
    search_fields = (
        "name",
        "website",
    )
    inlines = [VendorNameInline]
    actions = [make_public]

    def get_changeform_initial_data(self, request):
        """
        Setting current user and published as default.
        """
        get_data = super(VendorAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        get_data["is_public"] = True
        return get_data


@admin.register(Tea)
class TeaAdmin(admin.ModelAdmin):
    """
    Registering Tea model.
    """

    list_display = (
        "id",
        "name",
        "category",
        "link_to_subcategory",
        "link_to_vendor",
        "price",
        "created_on",
        "user",
        "is_archived",
    )
    list_filter = (
        "category",
        "vendor",
        "subcategory__origin__country",
        "subcategory__origin__region",
        "subcategory__origin__locality",
        "user",
        "is_archived",
    )

    def get_changeform_initial_data(self, request):
        """
        Setting current user as default.
        """
        get_data = super(TeaAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        return get_data

    def link_to_vendor(self, obj):
        """
        Vendor list entry links to foreignkey update page.
        """
        link = reverse("admin:catalog_vendor_change", args=[obj.vendor.id])
        return format_html(f'<a href="{link}">{obj.vendor.name}</a>')

    def link_to_subcategory(self, obj):
        """
        Subcategory list entry links to foreignkey update page.
        """
        link = reverse("admin:catalog_subcategory_change", args=[obj.subcategory.id])
        return format_html(f'<a href="{link}">{obj.subcategory.name}</a>')
