from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('programs/', views.programs, name='programs'),
    path('pricing/', views.pricing, name='pricing'),
    path('contact/', views.contact, name='contact'),

    path('products/<slug:slug>/', views.product_detail, name='product_detail'),

    # API
    path('api/subscribe/', views.subscribe, name='subscribe'),
]
