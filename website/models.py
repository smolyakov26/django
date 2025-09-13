from django.db import models
from django.core.validators import MinLengthValidator, URLValidator
from django.utils.text import slugify
from django.urls import reverse
import logging


def validate_button_link(value):
    """Allow http(s) URLs, mailto links, or root-relative paths starting with '/'."""
    from django.core.exceptions import ValidationError
    if not value:
        return
    value = value.strip()
    if value.startswith('/'):
        return
    if value.startswith('mailto:'):
        # Basic email after mailto:
        email_part = value[len('mailto:'):]
        if not email_part or '@' not in email_part:
            raise ValidationError('Invalid mailto link')
        return
    # Fallback to URL validation for http/https
    URLValidator(schemes=['http', 'https'])(value)

logger = logging.getLogger(__name__)


class SubscriptionManager(models.Manager):
    """Custom manager for Subscription model."""
    
    def active_subscriptions(self):
        """Return active subscriptions."""
        return self.filter(is_active=True)
    
    def recent_subscriptions(self, days=30):
        """Return subscriptions from the last N days."""
        from django.utils import timezone
        from datetime import timedelta
        cutoff_date = timezone.now() - timedelta(days=days)
        return self.filter(created_at__gte=cutoff_date)


class Subscription(models.Model):
    """Email subscription model with enhanced features."""
    
    email = models.EmailField(
        unique=True,
        help_text="Subscriber's email address"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the subscription is active"
    )
    source = models.CharField(
        max_length=50,
        default='website',
        help_text="Source of subscription (website, popup, etc.)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = SubscriptionManager()

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.email} ({'active' if self.is_active else 'inactive'})"
    
    def deactivate(self):
        """Deactivate the subscription."""
        self.is_active = False
        self.save(update_fields=['is_active', 'updated_at'])
        logger.info(f"Subscription deactivated: {self.email}")


class ProductCategory(models.Model):
    """Product category model."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Product Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductManager(models.Manager):
    """Custom manager for Product model."""
    
    def active(self):
        """Return only active products."""
        return self.filter(is_active=True)
    
    def featured(self):
        """Return featured products."""
        return self.filter(is_active=True, is_featured=True)
    
    def by_category(self, category_slug):
        """Return products by category."""
        return self.filter(category__slug=category_slug, is_active=True)


class Product(models.Model):
    """Enhanced product model with additional fields and validation."""
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Начинающий'),
        ('intermediate', 'Средний'),
        ('advanced', 'Продвинутый'),
        ('expert', 'Эксперт'),
    ]
    
    title = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(3)],
        help_text="Product title (minimum 3 characters)"
    )
    description = models.TextField(
        validators=[MinLengthValidator(10)],
        help_text="Detailed product description"
    )
    short_description = models.CharField(
        max_length=300,
        blank=True,
        help_text="Short description for cards and previews"
    )
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price in rubles"
    )
    duration_hours = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Duration in hours"
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='beginner'
    )
    button_text = models.CharField(
        max_length=100,
        default="Записаться"
    )
    button_link = models.CharField(
        max_length=200,
        blank=True,
        validators=[validate_button_link]
    )
    image_url = models.URLField(
        validators=[URLValidator()]
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        blank=True,
        help_text="URL slug (auto-generated if empty)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the product is active and visible"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Whether to feature this product"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Sort order (lower numbers appear first)"
    )

    # SEO fields
    meta_title = models.CharField(
        max_length=255,
        blank=True,
        help_text="SEO title (auto-generated if empty)"
    )
    meta_description = models.CharField(
        max_length=300,
        blank=True,
        help_text="SEO description (auto-generated if empty)"
    )
    keywords = models.CharField(
        max_length=300,
        blank=True,
        help_text="SEO keywords"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = ProductManager()

    class Meta:
        ordering = ['sort_order', 'created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['category']),
            models.Index(fields=['sort_order']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        """Return the absolute URL for this product."""
        return reverse('product_detail', kwargs={'slug': self.slug})
    
    def get_short_description(self):
        """Return short description or truncated description."""
        if self.short_description:
            return self.short_description
        return self.description[:150] + '...' if len(self.description) > 150 else self.description
    
    def get_price_display(self):
        """Return formatted price or 'По запросу' if no price."""
        if self.price:
            return f"{self.price:,.0f} ₽"
        return "По запросу"

    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure slug uniqueness
            original_slug = self.slug
            counter = 1
            while Product.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        
        # Auto-generate SEO fields if not provided
        if not self.meta_title:
            self.meta_title = f"{self.title} — Skybound Academy"
        
        if not self.meta_description:
            self.meta_description = self.get_short_description()
        
        # Auto-generate short description if not provided
        if not self.short_description:
            self.short_description = self.description[:150] + '...' if len(self.description) > 150 else self.description
        
        super().save(*args, **kwargs)
        logger.info(f"Product saved: {self.title} (slug: {self.slug})")

    def clean(self):
        """Custom validation."""
        # Field-level validators handle button_link rules
        return super().clean()
