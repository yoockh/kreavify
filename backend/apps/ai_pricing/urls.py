from django.urls import path
from .views import AIPricingView, AIPricingUsageView

urlpatterns = [
    path('', AIPricingView.as_view(), name='ai_pricing'),
    path('usage/', AIPricingUsageView.as_view(), name='ai_pricing_usage'),
]
