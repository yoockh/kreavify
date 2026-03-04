from django.db import models
from apps.users.models import User
from .utils import generate_invoice_number, generate_slug
import uuid

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Terkirim'),
        ('paid', 'Dibayar'),
        ('cancelled', 'Dibatalkan'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=20, unique=True, blank=True)
    
    # Klien Info
    client_name = models.CharField(max_length=200)
    client_email = models.EmailField(blank=True)
    client_phone = models.CharField(max_length=20, blank=True)
    
    # Format items: [{"description": "Desain Logo", "qty": 1, "unit_price": 500000, "amount": 500000}]
    items = models.JSONField(default=list)
    
    # Kalkulasi (Di-calculate oleh backend)
    subtotal = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    total = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    due_date = models.DateField(null=True, blank=True)
    
    # Payment info
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, blank=True)
    midtrans_order_id = models.CharField(max_length=100, blank=True)
    midtrans_snap_token = models.CharField(max_length=255, blank=True)
    
    # Public route
    slug = models.SlugField(unique=True, max_length=12, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def calculate_totals(self):
        computed_subtotal = 0
        computed_items = []
        for item in self.items:
            qty = max(1, int(item.get('qty', 1)))
            unit_price = int(item.get('unit_price', 0))
            amount = qty * unit_price
            computed_subtotal += amount
            item['amount'] = amount
            item['qty'] = qty
            item['unit_price'] = unit_price
            computed_items.append(item)
            
        self.items = computed_items
        self.subtotal = computed_subtotal
        self.tax_amount = int(self.subtotal * (self.tax_percentage / 100))
        self.total = self.subtotal + self.tax_amount

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = generate_invoice_number(self.user)
        if not self.slug:
            self.slug = generate_slug()
        
        self.calculate_totals()
        super().save(*args, **kwargs)
