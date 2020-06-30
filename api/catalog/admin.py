from django.contrib import admin

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
)


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    pass


@admin.register(GongfuBrewing)
class GongfuBrewingAdmin(admin.ModelAdmin):
    pass


@admin.register(WesternBrewing)
class WesternBrewingAdmin(admin.ModelAdmin):
    pass


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Origin)
class OriginAdmin(admin.ModelAdmin):
    pass


class SubcategoryNameInline(admin.TabularInline):
    model = SubcategoryName
    extra = 0


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    inlines = [SubcategoryNameInline]


class VendorNameInline(admin.TabularInline):
    model = VendorTrademark
    extra = 0


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    inlines = [VendorNameInline]
