from django.db import models
from apps.users.models import User
from apps.services.models import Service


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
