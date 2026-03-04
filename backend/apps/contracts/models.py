from django.db import models
from apps.users.models import User
from apps.invoices.models import Invoice
import uuid


class Contract(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Aktif'),
        ('completed', 'Selesai'),
        ('cancelled', 'Dibatalkan'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts')
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='contracts')

    title = models.CharField(max_length=300)
    client_name = models.CharField(max_length=200)
    content = models.TextField()  # Markdown/HTML contract content
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Kontrak: {self.title} - {self.client_name}"
