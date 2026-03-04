from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from apps.invoices.models import Invoice
from apps.invoices.serializers import PublicInvoiceSerializer
from .services import create_snap_transaction
from django.utils import timezone
import hashlib
import os

class PublicPaymentInvoiceView(generics.RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = PublicInvoiceSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class CheckoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, slug):
        invoice = get_object_or_404(Invoice, slug=slug)
        
        if invoice.status == 'paid':
            return Response({"detail": "Invoice ini sudah dibayar."}, status=status.HTTP_400_BAD_REQUEST)
        if invoice.status != 'sent':
            return Response({"detail": "Hanya invoice status 'sent' yang bisa dibayar."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            snap_data = create_snap_transaction(invoice)
            
            # Save token and order id to database
            invoice.midtrans_snap_token = snap_data['token']
            invoice.midtrans_order_id = snap_data['order_id']
            invoice.save()

            return Response(snap_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Midtrans error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MidtransWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.data
        
        order_id = payload.get('order_id')
        status_code = payload.get('status_code')
        gross_amount = payload.get('gross_amount')
        signature_key = payload.get('signature_key')
        transaction_status = payload.get('transaction_status')
        payment_type = payload.get('payment_type', '')

        # Verifikasi signature
        server_key = os.environ.get('MIDTRANS_SERVER_KEY', '')
        hashed = hashlib.sha512(f"{order_id}{status_code}{gross_amount}{server_key}".encode('utf-8')).hexdigest()
        
        if hashed != signature_key:
            return Response({"detail": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invoice = Invoice.objects.get(midtrans_order_id=order_id)
        except Invoice.DoesNotExist:
            return Response({"detail": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

        if transaction_status in ['settlement', 'capture']:
            invoice.status = 'paid'
            invoice.paid_at = timezone.now()
            invoice.payment_method = payment_type
            invoice.save()
            return Response(status=status.HTTP_200_OK)
        
        # Midtrans will also send 'expire', 'cancel', 'deny' but we don't handle them for modifying invoice status, allowing creator to cancel/resend
        return Response(status=status.HTTP_200_OK)
