from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from apps.invoices.models import Invoice
from datetime import datetime


class TaxReportView(APIView):
    """Generate annual income report for tax/SPT purposes."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        year = request.query_params.get('year', datetime.now().year)
        year = int(year)

        paid_invoices = Invoice.objects.filter(
            user=request.user,
            status='paid',
            paid_at__year=year,
        )

        # Monthly breakdown
        monthly_data = (
            paid_invoices
            .annotate(month=TruncMonth('paid_at'))
            .values('month')
            .annotate(
                total=Sum('total'),
                count=Sum('id', distinct=True),
            )
            .order_by('month')
        )

        # Build 12-month array
        months = []
        month_names = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

        for m in range(1, 13):
            amount = 0
            inv_count = 0
            for entry in monthly_data:
                if entry['month'] and entry['month'].month == m:
                    amount = entry['total'] or 0
                    inv_count = paid_invoices.filter(paid_at__month=m).count()
                    break

            months.append({
                'month': m,
                'month_name': month_names[m - 1],
                'total_income': amount,
                'invoice_count': inv_count,
            })

        annual_total = sum(m['total_income'] for m in months)

        # PPh Final 0.5% UMKM estimate (PP 55/2022, bruto < 500jt/tahun)
        pph_rate = 0.005
        pph_estimate = int(annual_total * pph_rate)

        return Response({
            'year': year,
            'months': months,
            'annual_total': annual_total,
            'total_invoices_paid': paid_invoices.count(),
            'pph_final_rate': '0.5%',
            'pph_final_estimate': pph_estimate,
            'note': 'Estimasi PPh Final 0.5% UMKM (PP 55/2022). Berlaku jika omzet bruto < Rp 500 juta/tahun.',
        })
