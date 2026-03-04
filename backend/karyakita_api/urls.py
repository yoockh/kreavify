from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from apps.users.upload_views import ImageUploadView

def healthcheck(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', healthcheck),
    path('api/auth/', include('apps.users.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/invoices/', include('apps.invoices.urls')),
    path('api/pay/', include('apps.payments.urls')),
    path('api/ai/pricing/', include('apps.ai_pricing.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
    path('api/portfolio/', include('apps.services.portfolio_urls')),
    path('api/p/', include('apps.users.public_urls')),
    path('api/upload/', ImageUploadView.as_view()),
]
