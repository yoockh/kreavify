from django.db import models
from apps.users.models import User


class MarketPricing(models.Model):
    """Store market pricing data for AI recommendations"""
    EXPERIENCE_CHOICES = [
        ('junior', '0-2 tahun'),
        ('mid', '2-5 tahun'),
        ('senior', '5+ tahun'),
    ]
    
    service_category = models.CharField(max_length=20)  # From Service.CATEGORY_CHOICES
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES)
    min_price = models.DecimalField(max_digits=12, decimal_places=0)
    optimal_price = models.DecimalField(max_digits=12, decimal_places=0)
    max_price = models.DecimalField(max_digits=12, decimal_places=0)
    sample_size = models.IntegerField(default=0)  # Berapa data yang dipakai
    market_demand = models.FloatField(default=1.0)  # Demand multiplier
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['service_category', 'experience_level']
        ordering = ['-last_updated']


class AIPricingUsage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_pricing_usages')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"AI Pricing - {self.user.display_name} - {self.created_at}"
