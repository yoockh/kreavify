from django.db import models
from apps.users.models import User
from apps.services.models import Service


class RevenueForecast(models.Model):
    """Store ML predictions for revenue forecasting"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_forecasts')
    forecast_month = models.DateField()  # Bulan yang diprediksi
    predicted_amount = models.DecimalField(max_digits=15, decimal_places=0)
    confidence_score = models.FloatField(default=0.0)  # 0-1
    lower_bound = models.DecimalField(max_digits=15, decimal_places=0, default=0)  # Worst case
    upper_bound = models.DecimalField(max_digits=15, decimal_places=0, default=0)  # Best case
    insights = models.JSONField(default=dict)  # Store additional insights
    model_version = models.CharField(max_length=20, default='v1')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'forecast_month']
        ordering = ['-forecast_month']


class ProfileView(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile_views')
    viewer_ip = models.GenericIPAddressField(null=True, blank=True)
    referrer = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class ServiceClick(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='clicks')
    viewer_ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
