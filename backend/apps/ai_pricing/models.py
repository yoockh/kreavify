from django.db import models
from apps.users.models import User


class AIPricingUsage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_pricing_usages')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"AI Pricing - {self.user.display_name} - {self.created_at}"
