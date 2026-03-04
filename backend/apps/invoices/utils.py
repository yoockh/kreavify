import random
import string
from django.utils import timezone
from django.apps import apps
from django.db.models import Max


def generate_invoice_number(user):
    Invoice = apps.get_model('invoices', 'Invoice')
    current_year = timezone.now().year
    prefix = f"KK-{current_year}-"

    # Get the highest existing sequence number for this user this year
    latest = Invoice.objects.filter(
        user=user,
        invoice_number__startswith=prefix
    ).aggregate(max_num=Max('invoice_number'))

    seq = 1
    if latest['max_num']:
        try:
            parts = latest['max_num'].split('-')
            if len(parts) == 3:
                seq = int(parts[2]) + 1
        except (ValueError, IndexError):
            pass

    # Retry with incrementing seq if collision exists
    for attempt in range(10):
        candidate = f"{prefix}{seq + attempt:04d}"
        if not Invoice.objects.filter(invoice_number=candidate).exists():
            return candidate

    # Absolute fallback: random suffix
    rand = ''.join(random.choices(string.digits, k=4))
    return f"KK-{current_year}-R{rand}"


def generate_slug(length=8):
    letters_and_digits = string.ascii_lowercase + string.digits
    slug = ''.join(random.choice(letters_and_digits) for i in range(length))

    Invoice = apps.get_model('invoices', 'Invoice')
    while Invoice.objects.filter(slug=slug).exists():
        slug = ''.join(random.choice(letters_and_digits) for i in range(length))

    return slug
