import random
import string
from django.utils import timezone
from django.apps import apps
import datetime

def generate_invoice_number(user):
    Invoice = apps.get_model('invoices', 'Invoice')
    current_year = timezone.now().year
    # Format: KK-{YYYY}-{sequential_4_digit} per user per tahun
    latest_invoice = Invoice.objects.filter(
        user=user, 
        created_at__year=current_year
    ).order_by('-created_at').first()
    
    seq = 1
    if latest_invoice and latest_invoice.invoice_number:
        try:
            # parsing ex: KK-2026-0001
            parts = latest_invoice.invoice_number.split('-')
            if len(parts) == 3:
                seq = int(parts[2]) + 1
        except ValueError:
            pass

    return f"KK-{current_year}-{seq:04d}"

def generate_slug(length=8):
    letters_and_digits = string.ascii_lowercase + string.digits
    slug = ''.join(random.choice(letters_and_digits) for i in range(length))
    
    Invoice = apps.get_model('invoices', 'Invoice')
    while Invoice.objects.filter(slug=slug).exists():
        slug = ''.join(random.choice(letters_and_digits) for i in range(length))
        
    return slug
