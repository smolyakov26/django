from django.contrib import admin
from .models import Subscription, Product

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at")
    search_fields = ("email",)
    ordering = ("-created_at",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "button_text", "created_at")
    search_fields = ("title", "description")