"""
Sitemap configuration for Skybound Academy website.
"""
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Product, ProductCategory


class StaticViewSitemap(Sitemap):
    """Sitemap for static pages."""
    priority = 0.8
    changefreq = 'weekly'
    protocol = 'https'

    def items(self):
        return [
            'home',
            'about',
            'programs',
            'pricing',
            'contact',
        ]

    def location(self, item):
        return reverse(item)

    def lastmod(self, item):
        # You can customize this based on when pages were last updated
        from django.utils import timezone
        return timezone.now()


class ProductSitemap(Sitemap):
    """Sitemap for product pages."""
    changefreq = 'weekly'
    priority = 0.9
    protocol = 'https'

    def items(self):
        return Product.objects.active().select_related('category')

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()

    def priority(self, obj):
        # Featured products get higher priority
        return 1.0 if obj.is_featured else 0.7


class ProductCategorySitemap(Sitemap):
    """Sitemap for product category pages (if you add category views)."""
    changefreq = 'weekly'
    priority = 0.6
    protocol = 'https'

    def items(self):
        return ProductCategory.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.created_at

    def location(self, obj):
        # This would need a category detail view
        return f'/categories/{obj.slug}/'