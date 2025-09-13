from django.contrib import admin
from django.utils.html import format_html
from .models import Subscription, Product, ProductCategory


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    """Admin interface for ProductCategory model."""
    list_display = ('name', 'slug', 'is_active', 'product_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    
    def product_count(self, obj):
        """Display the number of products in this category."""
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Subscription model."""
    list_display = ('email', 'is_active', 'source', 'created_at', 'updated_at')
    list_filter = ('is_active', 'source', 'created_at')
    search_fields = ('email',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    actions = ['activate_subscriptions', 'deactivate_subscriptions']
    
    fieldsets = (
        (None, {
            'fields': ('email', 'is_active', 'source')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def activate_subscriptions(self, request, queryset):
        """Bulk activate subscriptions."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} subscriptions activated.')
    activate_subscriptions.short_description = 'Activate selected subscriptions'
    
    def deactivate_subscriptions(self, request, queryset):
        """Bulk deactivate subscriptions."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} subscriptions deactivated.')
    deactivate_subscriptions.short_description = 'Deactivate selected subscriptions'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Product model."""
    list_display = (
        'title', 'category', 'price_display', 'difficulty',
        'is_active', 'is_featured', 'sort_order', 'created_at'
    )
    list_filter = (
        'is_active', 'is_featured', 'difficulty', 'category', 'created_at'
    )
    search_fields = ('title', 'description', 'meta_title', 'keywords')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('sort_order', 'title')
    readonly_fields = ('created_at', 'updated_at', 'get_absolute_url')
    actions = ['activate_products', 'deactivate_products', 'feature_products']
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title', 'slug', 'category', 'description', 'short_description'
            )
        }),
        ('Product Details', {
            'fields': (
                'price', 'duration_hours', 'difficulty', 'sort_order'
            )
        }),
        ('Button & Image', {
            'fields': ('button_text', 'button_link', 'image_url')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'keywords'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'get_absolute_url'),
            'classes': ('collapse',)
        }),
    )
    
    def price_display(self, obj):
        """Display formatted price."""
        return obj.get_price_display()
    price_display.short_description = 'Price'
    
    def get_absolute_url(self, obj):
        """Display clickable URL."""
        if obj.pk:
            url = obj.get_absolute_url()
            return format_html('<a href="{}" target="_blank">{}</a>', url, url)
        return '-'
    get_absolute_url.short_description = 'View on site'
    
    def activate_products(self, request, queryset):
        """Bulk activate products."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} products activated.')
    activate_products.short_description = 'Activate selected products'
    
    def deactivate_products(self, request, queryset):
        """Bulk deactivate products."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} products deactivated.')
    deactivate_products.short_description = 'Deactivate selected products'
    
    def feature_products(self, request, queryset):
        """Bulk feature products."""
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} products featured.')
    feature_products.short_description = 'Feature selected products'


# Customize admin site
admin.site.site_header = 'Skybound Academy Admin'
admin.site.site_title = 'Skybound Academy'
admin.site.index_title = 'Welcome to Skybound Academy Administration'