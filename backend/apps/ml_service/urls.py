from django.urls import path
from .views import (
    RevenueForecastView,
    PricingRecommendationView,
    PricingAnalysisView,
    DashboardInsightsView,
)

urlpatterns = [
    path('revenue-forecast/', RevenueForecastView.as_view(), name='revenue-forecast'),
    path('pricing-recommendation/', PricingRecommendationView.as_view(), name='pricing-recommendation'),
    path('pricing-analysis/', PricingAnalysisView.as_view(), name='pricing-analysis'),
    path('dashboard-insights/', DashboardInsightsView.as_view(), name='dashboard-insights'),
]
