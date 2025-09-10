from django.shortcuts import render
from .models import Subscription, Product
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from .models import Subscription
from django.shortcuts import render, get_object_or_404

def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    return render(request, "website/product_detail.html", {"product": product})

def home(request):
    products = Product.objects.all()
    return render(request, "website/index.html", {"products": products})

def about(request):
    return render(request, 'website/placeholder.html', {'title': 'О нас'})

def programs(request):
    return render(request, 'website/placeholder.html', {'title': 'Программы'})

def pricing(request):
    return render(request, 'website/placeholder.html', {'title': 'Цены'})

def contact(request):
    return render(request, 'website/placeholder.html', {'title': 'Контакты'})



@csrf_exempt   # (optional, we'll use CSRF in script.js anyway)
@require_POST
def subscribe(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        if not email:
            return JsonResponse({"success": False, "error": "Email required"}, status=400)
        sub, created = Subscription.objects.get_or_create(email=email)
        return JsonResponse({"success": True, "created": created})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
