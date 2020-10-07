from django.contrib import admin
from django.forms import ModelForm
from django.urls import reverse
from django.utils.html import format_html

from .models import (
    Brewing,
    BrewingSession,
    Category,
    CategoryName,
    CustomUser,
    Origin,
    Subcategory,
    SubcategoryName,
    Tea,
    Vendor,
    VendorTrademark,
)
from .serializers import custom_get_or_create


def make_public(modeladmin, request, queryset):
    """
    Defines list action to publish instances.
    """
    queryset.update(is_public=True)


make_public.short_description = "Mark selected as public"


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    """
    Registers CustomUser model.
    """

    list_display = (
        "email",
        "joined_at",
        "is_staff",
        "is_active",
        "id",
    )
    search_fields = ("email",)


class CategoryNameInline(admin.TabularInline):
    """
    Defines CategoryName model as Subcategory tabular inline.
    """

    model = CategoryName
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Registers Category model.
    """

    list_display = (
        "name",
        "gongfu_brewing",
        "western_brewing",
    )
    inlines = [CategoryNameInline]


class BrewingForm(ModelForm):
    """
    Custom Brewing form returns instance on save if existing.
    """

    def clean(self):
        pass

    def save_m2m(self):
        instance, _ = Brewing.objects.get_or_create(**self.cleaned_data)
        return instance

    def save(self, commit=True):
        instance, _ = Brewing.objects.get_or_create(**self.cleaned_data)
        return instance


@admin.register(Brewing)
class BrewingAdmin(admin.ModelAdmin):
    """
    Registers Brewing model.
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
    form = BrewingForm


class OriginForm(ModelForm):
    """
    Custom Origin form returns instance on save if existing.
    """

    def clean(self):
        pass

    def save_m2m(self):
        return self.save()

    def save(self, commit=True):
        """
        Checks if public or user private matching instance exists and returns it.
        If not creates a new one.
        """
        query_data = {"country": self.cleaned_data["country"], "is_public": True}
        if "region" in self.cleaned_data:
            query_data["region"] = self.cleaned_data["region"]
        if "locality" in self.cleaned_data:
            query_data["locality"] = self.cleaned_data["locality"]

        try:
            instance = Origin.objects.get(**query_data)
        except Origin.DoesNotExist:
            try:
                query_data["is_public"] = False
                query_data["user"] = self.cleaned_data["user"]
                instance = Origin.objects.get(**query_data)
            except Origin.DoesNotExist:
                instance = None

        if not instance:
            instance = Origin(**self.cleaned_data)
            instance.save()

        return instance


@admin.register(Origin)
class OriginAdmin(admin.ModelAdmin):
    """
    Registers Origin model.
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
        Sets current user and public as default.
        """
        get_data = super(OriginAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        get_data["is_public"] = True
        return get_data


class SubcategoryNameInline(admin.TabularInline):
    """
    Defines SubcategoryName model as Subcategory tabular inline.
    """

    model = SubcategoryName
    extra = 0


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    """
    Registers Subcategory model.
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
        Sets current user and public as default.
        """
        get_data = super(SubcategoryAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        get_data["is_public"] = True
        return get_data


class VendorNameInline(admin.TabularInline):
    """
    Defines VendorName model as Vendor tabular inline.
    """

    model = VendorTrademark
    extra = 0


class VendorForm(ModelForm):
    """
    Custom Vendor form returns instance on save if existing.
    """

    def clean(self):
        pass

    def save_m2m(self):
        return self.save()

    def save(self, commit=True):
        return custom_get_or_create(Vendor, self.cleaned_data)


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    """
    Registers Vendor model.
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
    form = VendorForm

    def get_changeform_initial_data(self, request):
        """
        Sets current user and public as default.
        """
        get_data = super(VendorAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        get_data["is_public"] = True
        return get_data


@admin.register(Tea)
class TeaAdmin(admin.ModelAdmin):
    """
    Registers Tea model.
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
    ordering = ("-created_on",)

    def get_changeform_initial_data(self, request):
        """
        Sets current user as default.
        """
        get_data = super(TeaAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        return get_data

    def link_to_vendor(self, obj):
        """
        Vendor list entry links to foreignkey update page.
        """
        if not obj.vendor:
            return None
        link = reverse("admin:catalog_vendor_change", args=[obj.vendor.id])
        return format_html(f'<a href="{link}">{obj.vendor.name}</a>')

    def link_to_subcategory(self, obj):
        """
        Subcategory list entry links to foreignkey update page.
        """
        if not obj.subcategory:
            return None
        link = reverse("admin:catalog_subcategory_change", args=[obj.subcategory.id])
        return format_html(f'<a href="{link}">{obj.subcategory.name}</a>')


@admin.register(BrewingSession)
class BrewingSessionAdmin(admin.ModelAdmin):
    """
    Registers BrewingSession model.
    """

    list_display = (
        "id",
        "created_on",
        "tea",
        "name",
        "user",
        "is_completed",
    )
    list_filter = (
        "user",
        "is_completed",
    )
    ordering = ("-created_on",)

    def get_changeform_initial_data(self, request):
        """
        Sets current user as default.
        """
        get_data = super(BrewingSessionAdmin, self).get_changeform_initial_data(request)
        get_data["user"] = request.user.pk
        return get_data

    def link_to_tea(self, obj):
        """
        Tea list entry links to foreignkey update page.
        """
        if not obj.tea:
            return None
        link = reverse("admin:catalog_tea_change", args=[obj.tea.id])
        return format_html(f'<a href="{link}">{obj.tea.name}</a>')
