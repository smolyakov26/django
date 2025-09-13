from django.urls import path
from . import views

urlpatterns = [
    # Main pages
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('programs/', views.programs, name='programs'),
    path('pricing/', views.pricing, name='pricing'),
    path('contact/', views.contact, name='contact'),
    path('special-offers/', views.special_offers, name='special_offers'),

    # Product pages
    path('products/<slug:slug>/', views.product_detail, name='product_detail'),
    
    # Alternative class-based views (commented out, can be used instead)
    # path('', views.ProductListView.as_view(), name='home'),
    # path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail'),

    # API endpoints
    path('api/subscribe/', views.subscribe, name='subscribe'),
    path('api/health/', views.health_check, name='health_check'),
]
