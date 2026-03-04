from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils import timezone
from apps.invoices.models import Invoice
from urllib.parse import quote


class InvoiceReminderView(APIView):
    """Generate reminder message + WhatsApp link for unpaid invoices."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk, user=request.user)
        except Invoice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if invoice.status != 'sent':
            return Response(
                {'error': 'Hanya invoice yang sudah dikirim yang bisa di-remind.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        currency = getattr(invoice, 'currency', 'IDR')
        total_formatted = f"{currency} {invoice.total:,.0f}"
        payment_url = f"{request.build_absolute_uri('/')[:-1].replace('/api', '')}/pay/{invoice.slug}"

        # WhatsApp message
        wa_message = f"""Halo {invoice.client_name},

Ini adalah pengingat untuk invoice *#{invoice.invoice_number}* dengan total tagihan *{total_formatted}*.

Silakan lakukan pembayaran melalui link berikut:
{payment_url}

Terima kasih atas kerjasamanya!

Salam,
{user.display_name} - Kreavify"""

        # Email
        email_subject = f"Reminder: Invoice #{invoice.invoice_number} - {total_formatted}"
        email_body = f"""Yth. {invoice.client_name},

Ini adalah pengingat untuk invoice #{invoice.invoice_number} yang belum dibayar.

Detail:
- Nomor Invoice: {invoice.invoice_number}
- Total Tagihan: {total_formatted}
- Link Pembayaran: {payment_url}

Mohon segera melakukan pembayaran. Jika sudah membayar, abaikan pesan ini.

Terima kasih,
{user.display_name}
{user.phone or user.email}"""

        # Generate WhatsApp URL
        phone = invoice.client_phone.replace('+', '').replace('-', '').replace(' ', '') if invoice.client_phone else ''
        if phone and phone.startswith('0'):
            phone = '62' + phone[1:]

        whatsapp_url = f"https://wa.me/{phone}?text={quote(wa_message)}" if phone else None

        # Update last reminded
        invoice.last_reminded_at = timezone.now()
        invoice.save(update_fields=['last_reminded_at'])

        return Response({
            'whatsapp_url': whatsapp_url,
            'whatsapp_message': wa_message,
            'email_subject': email_subject,
            'email_body': email_body,
            'client_phone': invoice.client_phone,
            'client_email': invoice.client_email,
            'last_reminded_at': invoice.last_reminded_at.isoformat(),
        })
