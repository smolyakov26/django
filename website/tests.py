"""
Comprehensive tests for the Skybound Academy website.
"""
from django.test import TestCase, Client
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils.text import slugify
import json
from .models import Subscription, Product, ProductCategory


class ProductCategoryModelTest(TestCase):
    """Test cases for ProductCategory model."""
    
    def setUp(self):
        self.category = ProductCategory.objects.create(
            name="Skydiving",
            description="Skydiving courses and experiences"
        )
    
    def test_category_creation(self):
        """Test category creation and string representation."""
        self.assertEqual(str(self.category), "Skydiving")
        self.assertEqual(self.category.slug, "skydiving")
        self.assertTrue(self.category.is_active)
    
    def test_slug_auto_generation(self):
        """Test automatic slug generation."""
        category = ProductCategory.objects.create(name="Test Category")
        self.assertEqual(category.slug, "test-category")


class SubscriptionModelTest(TestCase):
    """Test cases for Subscription model."""
    
    def setUp(self):
        self.subscription = Subscription.objects.create(
            email="test@example.com",
            source="website"
        )
    
    def test_subscription_creation(self):
        """Test subscription creation and string representation."""
        self.assertEqual(str(self.subscription), "test@example.com (active)")
        self.assertTrue(self.subscription.is_active)
        self.assertEqual(self.subscription.source, "website")
    
    def test_subscription_deactivation(self):
        """Test subscription deactivation."""
        self.subscription.deactivate()
        self.assertFalse(self.subscription.is_active)
    
    def test_unique_email_constraint(self):
        """Test that duplicate emails are not allowed."""
        with self.assertRaises(Exception):
            Subscription.objects.create(email="test@example.com")
    
    def test_subscription_managers(self):
        """Test custom managers."""
        # Create inactive subscription
        inactive_sub = Subscription.objects.create(
            email="inactive@example.com",
            is_active=False
        )
        
        active_subs = Subscription.objects.active_subscriptions()
        self.assertEqual(active_subs.count(), 1)
        self.assertIn(self.subscription, active_subs)
        self.assertNotIn(inactive_sub, active_subs)


class ProductModelTest(TestCase):
    """Test cases for Product model."""
    
    def setUp(self):
        self.category = ProductCategory.objects.create(name="Skydiving")
        self.product = Product.objects.create(
            title="Tandem Jump",
            description="Experience the thrill of skydiving with an instructor",
            category=self.category,
            price=5000.00,
            duration_hours=2,
            difficulty="beginner",
            image_url="https://example.com/image.jpg"
        )
    
    def test_product_creation(self):
        """Test product creation and auto-generated fields."""
        self.assertEqual(str(self.product), "Tandem Jump")
        self.assertEqual(self.product.slug, "tandem-jump")
        self.assertEqual(self.product.meta_title, "Tandem Jump — Skybound Academy")
        self.assertTrue(self.product.is_active)
        self.assertFalse(self.product.is_featured)
    
    def test_get_absolute_url(self):
        """Test get_absolute_url method."""
        expected_url = reverse('product_detail', kwargs={'slug': self.product.slug})
        self.assertEqual(self.product.get_absolute_url(), expected_url)
    
    def test_get_price_display(self):
        """Test price display formatting."""
        self.assertEqual(self.product.get_price_display(), "5,000 ₽")
        
        # Test product without price
        product_no_price = Product.objects.create(
            title="Free Consultation",
            description="Free consultation",
            image_url="https://example.com/image.jpg"
        )
        self.assertEqual(product_no_price.get_price_display(), "По запросу")
    
    def test_slug_uniqueness(self):
        """Test slug uniqueness handling."""
        # Create another product with the same title
        product2 = Product.objects.create(
            title="Tandem Jump",
            description="Another tandem jump",
            image_url="https://example.com/image.jpg"
        )
        self.assertEqual(product2.slug, "tandem-jump-1")
    
    def test_product_validation(self):
        """Test product validation."""
        product = Product(
            title="Test",
            description="Test description",
            button_link="invalid-url",
            image_url="https://example.com/image.jpg"
        )
        with self.assertRaises(ValidationError):
            product.full_clean()
    
    def test_product_managers(self):
        """Test custom managers."""
        # Create inactive product
        inactive_product = Product.objects.create(
            title="Inactive Product",
            description="This is inactive",
            is_active=False,
            image_url="https://example.com/image.jpg"
        )
        
        # Create featured product
        featured_product = Product.objects.create(
            title="Featured Product",
            description="This is featured",
            is_featured=True,
            image_url="https://example.com/image.jpg"
        )
        
        active_products = Product.objects.active()
        featured_products = Product.objects.featured()
        
        self.assertEqual(active_products.count(), 2)  # self.product and featured_product
        self.assertEqual(featured_products.count(), 1)
        self.assertIn(featured_product, featured_products)


class ViewsTest(TestCase):
    """Test cases for views."""
    
    def setUp(self):
        self.client = Client()
        self.category = ProductCategory.objects.create(name="Skydiving")
        self.product = Product.objects.create(
            title="Test Product",
            description="Test description",
            category=self.category,
            price=1000.00,
            image_url="https://example.com/image.jpg"
        )
    
    def test_home_view(self):
        """Test home page view."""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Product")
        self.assertIn('products', response.context)
    
    def test_product_detail_view(self):
        """Test product detail view."""
        response = self.client.get(
            reverse('product_detail', kwargs={'slug': self.product.slug})
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Product")
        self.assertEqual(response.context['product'], self.product)
    
    def test_product_detail_404(self):
        """Test product detail view with non-existent slug."""
        response = self.client.get(
            reverse('product_detail', kwargs={'slug': 'non-existent'})
        )
        self.assertEqual(response.status_code, 404)
    
    def test_about_view(self):
        """Test about page view."""
        response = self.client.get(reverse('about'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "О нас")
    
    def test_programs_view(self):
        """Test programs page view."""
        response = self.client.get(reverse('programs'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Программы")
    
    def test_pricing_view(self):
        """Test pricing page view."""
        response = self.client.get(reverse('pricing'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Цены")
    
    def test_contact_view(self):
        """Test contact page view."""
        response = self.client.get(reverse('contact'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Контакты")
    
    def test_health_check_view(self):
        """Test health check API endpoint."""
        response = self.client.get(reverse('health_check'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'healthy')


class SubscriptionAPITest(TestCase):
    """Test cases for subscription API."""
    
    def setUp(self):
        self.client = Client()
        self.subscribe_url = reverse('subscribe')
    
    def test_valid_subscription(self):
        """Test valid email subscription."""
        data = {'email': 'test@example.com', 'source': 'popup'}
        response = self.client.post(
            self.subscribe_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertTrue(response_data['created'])
        
        # Verify subscription was created
        self.assertTrue(
            Subscription.objects.filter(email='test@example.com').exists()
        )
    
    def test_duplicate_subscription(self):
        """Test duplicate email subscription."""
        # Create initial subscription
        Subscription.objects.create(email='test@example.com')
        
        data = {'email': 'test@example.com'}
        response = self.client.post(
            self.subscribe_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertFalse(response_data['created'])
    
    def test_invalid_email_subscription(self):
        """Test invalid email subscription."""
        data = {'email': 'invalid-email'}
        response = self.client.post(
            self.subscribe_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertIn('error', response_data)
    
    def test_empty_email_subscription(self):
        """Test empty email subscription."""
        data = {'email': ''}
        response = self.client.post(
            self.subscribe_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
    
    def test_invalid_json_subscription(self):
        """Test invalid JSON in subscription request."""
        response = self.client.post(
            self.subscribe_url,
            data='invalid json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
    
    def test_get_method_not_allowed(self):
        """Test that GET method is not allowed for subscription."""
        response = self.client.get(self.subscribe_url)
        self.assertEqual(response.status_code, 405)  # Method not allowed
    
    def test_reactivate_inactive_subscription(self):
        """Test reactivating an inactive subscription."""
        # Create inactive subscription
        Subscription.objects.create(
            email='test@example.com',
            is_active=False
        )
        
        data = {'email': 'test@example.com', 'source': 'website'}
        response = self.client.post(
            self.subscribe_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertTrue(response_data['created'])  # Treated as new
        
        # Verify subscription was reactivated
        subscription = Subscription.objects.get(email='test@example.com')
        self.assertTrue(subscription.is_active)
        self.assertEqual(subscription.source, 'website')


class AdminTest(TestCase):
    """Test cases for admin interface."""
    
    def setUp(self):
        self.user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password'
        )
        self.client.login(username='admin', password='password')
        
        self.category = ProductCategory.objects.create(name="Test Category")
        self.product = Product.objects.create(
            title="Test Product",
            description="Test description",
            category=self.category,
            image_url="https://example.com/image.jpg"
        )
        self.subscription = Subscription.objects.create(email="test@example.com")
    
    def test_admin_access(self):
        """Test admin interface access."""
        response = self.client.get('/admin/')
        self.assertEqual(response.status_code, 200)
    
    def test_product_admin_list(self):
        """Test product admin list view."""
        response = self.client.get('/admin/website/product/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Product")
    
    def test_subscription_admin_list(self):
        """Test subscription admin list view."""
        response = self.client.get('/admin/website/subscription/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "test@example.com")
    
    def test_category_admin_list(self):
        """Test category admin list view."""
        response = self.client.get('/admin/website/productcategory/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Category")
