from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth
from apps.invoices.models import Invoice
from apps.invoices.serializers import InvoiceSerializer

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        invoices = Invoice.objects.filter(user=user)
        
        total_invoices = invoices.count()
        paid_invoices = invoices.filter(status='paid')
        total_revenue = paid_invoices.aggregate(sum=Sum('total'))['sum'] or 0
        
        pending_amount = invoices.filter(status='sent').aggregate(sum=Sum('total'))['sum'] or 0
        
        paid_count = paid_invoices.count()
        pending_count = invoices.filter(status='sent').count()
        draft_count = invoices.filter(status='draft').count()
        
        # Monthly Revenue Trend (Last 6 Months)
        monthly_revenue_qs = paid_invoices.annotate(
            month=TruncMonth('paid_at')
        ).values('month').annotate(
            amount=Sum('total')
        ).order_by('month')
        
        monthly_revenue = [
            {
                "month": entry['month'].strftime('%Y-%m') if entry['month'] else None,
                "amount": entry['amount']
            } for entry in monthly_revenue_qs if entry['month']
        ]
        
        recent_invoices = InvoiceSerializer(invoices.order_by('-created_at')[:5], many=True).data

        return Response({
            "total_invoices": total_invoices,
            "total_revenue": total_revenue,
            "pending_amount": pending_amount,
            "paid_count": paid_count,
            "pending_count": pending_count,
            "draft_count": draft_count,
            "monthly_revenue": monthly_revenue,
            "recent_invoices": recent_invoices
        })
