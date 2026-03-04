from django.urls import path
from .views import AIPricingView

urlpatterns = [
    path('', AIPricingView.as_view(), name='ai_pricing'),
]
