"""
Views for the Skybound Academy website.
"""
import json
import logging
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.cache import cache_page
from django.views.generic import ListView, DetailView
from django.core.validators import validate_email
from django.db import IntegrityError
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.utils import timezone
from .models import Subscription, Product, ProductCategory

logger = logging.getLogger(__name__)


class ProductListView(ListView):
    """Class-based view for product listing with caching."""
    model = Product
    template_name = 'website/index.html'
    context_object_name = 'products'
    queryset = Product.objects.active().select_related('category')
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['featured_products'] = Product.objects.featured()[:3]
        context['categories'] = ProductCategory.objects.filter(is_active=True)
        return context


class ProductDetailView(DetailView):
    """Class-based view for product detail with SEO optimization."""
    model = Product
    template_name = 'website/product_detail.html'
    context_object_name = 'product'
    queryset = Product.objects.active().select_related('category')
    
    @method_decorator(cache_page(60 * 30))  # Cache for 30 minutes
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Add related products from the same category
        if self.object.category:
            context['related_products'] = Product.objects.active().filter(
                category=self.object.category
            ).exclude(pk=self.object.pk)[:3]
        return context


# Function-based views for simple pages
@cache_page(60 * 60)  # Cache for 1 hour
def home(request):
    """Home page view with featured products."""
    try:
        products = Product.objects.active().select_related('category')
        featured_products = Product.objects.featured()[:3]
        categories = ProductCategory.objects.filter(is_active=True)
        
        context = {
            'products': products,
            'featured_products': featured_products,
            'categories': categories,
        }
        return render(request, "website/index.html", context)
    except Exception as e:
        logger.error(f"Error in home view: {str(e)}")
        messages.error(request, "Произошла ошибка при загрузке страницы.")
        return render(request, "website/index.html", {'products': []})


def product_detail(request, slug):
    """Product detail view with error handling."""
    try:
        product = get_object_or_404(Product.objects.active().select_related('category'), slug=slug)
        
        # Get related products from the same category
        related_products = []
        if product.category:
            related_products = Product.objects.active().filter(
                category=product.category
            ).exclude(pk=product.pk)[:3]
        
        context = {
            'product': product,
            'related_products': related_products,
        }
        return render(request, "website/product_detail.html", context)
    except Exception as e:
        logger.error(f"Error in product_detail view for slug {slug}: {str(e)}")
        messages.error(request, "Продукт не найден.")
        return render(request, "404.html", status=404)


@cache_page(60 * 60)  # Cache for 1 hour
def about(request):
    """About page view."""
    return render(request, 'website/about.html')


@cache_page(60 * 60)  # Cache for 1 hour
def programs(request):
    """Programs page view."""
    try:
        products = Product.objects.active().select_related('category')
        categories = ProductCategory.objects.filter(is_active=True)
        context = {
            'products': products,
            'categories': categories,
        }
        return render(request, 'website/programs.html', context)
    except Exception as e:
        logger.error(f"Error in programs view: {str(e)}")
        return render(request, 'website/programs.html', {'products': []})


@cache_page(60 * 60)  # Cache for 1 hour
def pricing(request):
    """Pricing page view."""
    try:
        products_with_prices = Product.objects.active().exclude(price__isnull=True)
        context = {
            'products': products_with_prices,
        }
        return render(request, 'website/pricing.html', context)
    except Exception as e:
        logger.error(f"Error in pricing view: {str(e)}")
        return render(request, 'website/pricing.html', {'products': []})


@cache_page(60 * 60)  # Cache for 1 hour
def contact(request):
    """Contact page view."""
    return render(request, 'website/contact.html')


@cache_page(60 * 60)  # Cache for 1 hour
def special_offers(request):
    """Special offers page view."""
    return render(request, 'website/special_offers.html')


@require_POST
def subscribe(request):
    """
    API endpoint for email subscription with proper validation and error handling.
    """
    try:
        # Parse JSON data
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            logger.warning("Invalid JSON in subscription request")
            return JsonResponse({
                "success": False,
                "error": "Неверный формат данных"
            }, status=400)
        
        # Validate email
        email = data.get("email", "").strip().lower()
        if not email:
            return JsonResponse({
                "success": False,
                "error": "Email обязателен"
            }, status=400)
        
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({
                "success": False,
                "error": "Неверный формат email"
            }, status=400)
        
        # Get source information
        source = data.get("source", "website")
        
        # Create or get subscription
        try:
            subscription, created = Subscription.objects.get_or_create(
                email=email,
                defaults={'source': source}
            )
            
            if not created and not subscription.is_active:
                # Reactivate inactive subscription
                subscription.is_active = True
                subscription.source = source
                subscription.save(update_fields=['is_active', 'source', 'updated_at'])
                created = True  # Treat as new for response
            
            logger.info(f"Subscription {'created' if created else 'exists'}: {email}")
            
            return JsonResponse({
                "success": True,
                "created": created,
                "message": "Спасибо за подписку!" if created else "Вы уже подписаны"
            })
            
        except IntegrityError as e:
            logger.error(f"Database error in subscription: {str(e)}")
            return JsonResponse({
                "success": False,
                "error": "Ошибка базы данных"
            }, status=500)
            
    except Exception as e:
        logger.error(f"Unexpected error in subscribe view: {str(e)}")
        return JsonResponse({
            "success": False,
            "error": "Внутренняя ошибка сервера"
        }, status=500)


@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint for monitoring."""
    try:
        # Simple database check
        Product.objects.count()
        return JsonResponse({"status": "healthy", "timestamp": timezone.now().isoformat()})
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JsonResponse({"status": "unhealthy", "error": str(e)}, status=500)
