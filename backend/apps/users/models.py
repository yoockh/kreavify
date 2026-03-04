from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
import string
import random

def generate_random_string(length=4):
    letters = string.ascii_lowercase + string.digits
    return ''.join(random.choice(letters) for i in range(length))

class User(AbstractUser):
    # Override: email as login field
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    # Profile fields
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    profession = models.CharField(max_length=20, choices=[
        ('designer', 'Desainer Grafis'),
        ('photographer', 'Fotografer'),
        ('videographer', 'Videografer'),
        ('writer', 'Penulis/Copywriter'),
        ('musician', 'Musisi/Sound Engineer'),
        ('developer', 'Developer/Programmer'),
        ('other', 'Lainnya'),
    ], default='designer')
    phone = models.CharField(max_length=20, blank=True)
    avatar_url = models.URLField(blank=True)
    banner_url = models.URLField(blank=True)
    slug = models.SlugField(unique=True, max_length=50, blank=True)
    
    # Bank info
    bank_name = models.CharField(max_length=50, blank=True)
    bank_account_number = models.CharField(max_length=30, blank=True)
    bank_account_name = models.CharField(max_length=100, blank=True)

    # Branded Invoice
    invoice_logo_url = models.URLField(blank=True)
    invoice_accent_color = models.CharField(max_length=7, blank=True, default='')  # hex e.g. #2563eb
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.username)
            if not base_slug:
                base_slug = "user"
            unique_slug = base_slug
            while User.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{generate_random_string()}"
            self.slug = unique_slug
        super().save(*args, **kwargs)
