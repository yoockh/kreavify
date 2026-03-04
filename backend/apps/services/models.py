from django.db import models
from apps.users.models import User

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('logo', 'Desain Logo'),
        ('branding', 'Branding & Identity'),
        ('social_media', 'Desain Social Media'),
        ('illustration', 'Ilustrasi'),
        ('photo_product', 'Foto Produk'),
        ('photo_event', 'Foto Event'),
        ('video_promo', 'Video Promosi'),
        ('video_event', 'Video Event'),
        ('copywriting', 'Copywriting'),
        ('translation', 'Penerjemahan'),
        ('music', 'Produksi Musik'),
        ('web_dev', 'Web Development'),
        ('other', 'Lainnya'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=1000, blank=True)
    base_price = models.DecimalField(max_digits=12, decimal_places=0)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)
    image_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class PortfolioItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolio')
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=500, blank=True)
    image_url = models.URLField()
    category = models.CharField(max_length=20, choices=Service.CATEGORY_CHOICES, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
