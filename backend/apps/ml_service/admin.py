from django.contrib import admin
from apps.analytics.models import RevenueForecast
from apps.ai_pricing.models import MarketPricing


@admin.register(RevenueForecast)
class RevenueForecastAdmin(admin.ModelAdmin):
    list_display = ['user', 'forecast_month', 'predicted_amount', 'confidence_score', 'created_at']
    list_filter = ['forecast_month', 'created_at']
    search_fields = ['user__email', 'user__display_name']
    readonly_fields = ['created_at']


@admin.register(MarketPricing)
class MarketPricingAdmin(admin.ModelAdmin):
    list_display = ['service_category', 'experience_level', 'optimal_price', 'sample_size', 'last_updated']
    list_filter = ['service_category', 'experience_level']
    search_fields = ['service_category']
