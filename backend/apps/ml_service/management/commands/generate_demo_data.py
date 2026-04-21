"""
Management command to generate synthetic invoice data for ML demo
Usage: python manage.py generate_demo_data --user-email=user@example.com
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Avg
from datetime import timedelta
from dateutil.relativedelta import relativedelta
import random

from apps.users.models import User
from apps.invoices.models import Invoice


class Command(BaseCommand):
    help = 'Generate synthetic invoice data for ML demo'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-email',
            type=str,
            help='Email of user to generate data for',
        )
        parser.add_argument(
            '--months',
            type=int,
            default=6,
            help='Number of months of historical data',
        )

    def handle(self, *args, **options):
        user_email = options.get('user_email')
        months = options.get('months', 6)

        if not user_email:
            self.stdout.write(self.style.ERROR('Please provide --user-email'))
            return

        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User {user_email} not found'))
            return

        self.stdout.write(f'Generating {months} months of data for {user.email}...')

        # Generate historical invoices
        base_amount = 2000000  # Base 2 juta
        now = timezone.now()

        for i in range(months):
            month_ago = now - relativedelta(months=months-i)
            
            # Random 2-4 invoices per month
            num_invoices = random.randint(2, 4)
            
            for j in range(num_invoices):
                # Random amount with some variation
                variation = random.uniform(0.7, 1.5)
                amount = int(base_amount * variation)
                
                # Random paid date within the month
                days_offset = random.randint(0, 28)
                paid_date = month_ago + timedelta(days=days_offset)
                
                # Random due date (before paid date)
                due_date = paid_date - timedelta(days=random.randint(0, 7))
                
                invoice = Invoice.objects.create(
                    user=user,
                    client_name=f'Demo Client {random.randint(1, 10)}',
                    client_email=f'client{random.randint(1, 10)}@example.com',
                    items=[{
                        'description': f'Demo Service {j+1}',
                        'qty': 1,
                        'unit_price': amount,
                        'amount': amount
                    }],
                    status='paid',
                    due_date=due_date.date(),
                    paid_at=paid_date,
                    payment_method='bank_transfer',
                    currency='IDR'
                )
                
                self.stdout.write(
                    f'Created invoice {invoice.invoice_number} - '
                    f'Rp {amount:,} - {paid_date.strftime("%Y-%m-%d")}'
                )

        # Update user stats
        total_invoices = Invoice.objects.filter(user=user, status='paid').count()
        avg_value = Invoice.objects.filter(user=user, status='paid').aggregate(
            avg=Avg('total')
        )['avg'] or 0

        user.total_projects_completed = total_invoices
        user.average_project_value = int(avg_value)
        user.save()

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully generated {total_invoices} invoices for {user.email}'
            )
        )
        self.stdout.write(f'Average project value: Rp {avg_value:,.0f}')
