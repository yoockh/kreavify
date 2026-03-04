from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from .models import Contract
from .serializers import ContractSerializer
from apps.invoices.models import Invoice
import os
import requests


class ContractListView(generics.ListAPIView):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contract.objects.filter(user=self.request.user)


class ContractDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contract.objects.filter(user=self.request.user)


class GenerateContractView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        invoice_id = request.data.get('invoice_id')
        if not invoice_id:
            return Response({'error': 'invoice_id required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            invoice = Invoice.objects.get(id=invoice_id, user=request.user)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        items_desc = ', '.join([f"{item.get('description', '')} (Qty: {item.get('qty', 1)}, Harga: Rp {item.get('unit_price', 0):,})" for item in invoice.items])

        currency = getattr(invoice, 'currency', 'IDR')
        prompt = f"""Buatkan kontrak kerja freelance dalam Bahasa Indonesia yang profesional dan lengkap secara hukum.

Data:
- Nama Freelancer: {user.display_name}
- Profesi: {user.profession}
- Email: {user.email}
- Nama Klien: {invoice.client_name}
- Email Klien: {invoice.client_email or 'Tidak tertera'}
- Layanan: {items_desc}
- Total Nilai Kontrak: {currency} {invoice.total:,.0f}
- Tanggal: {invoice.created_at.strftime('%d %B %Y')}
- Jatuh Tempo: {invoice.due_date.strftime('%d %B %Y') if invoice.due_date else 'Tidak ditentukan'}

Format kontrak harus mencakup:
1. Judul "KONTRAK KERJA FREELANCE"
2. Identitas Para Pihak (Pihak Pertama = Klien, Pihak Kedua = Freelancer)
3. Ruang Lingkup Pekerjaan
4. Jadwal & Tenggat Waktu
5. Nilai Kontrak & Pembayaran
6. Hak Kekayaan Intelektual
7. Kerahasiaan
8. Revisi & Perubahan
9. Pembatalan & Force Majeure
10. Penyelesaian Sengketa
11. Penutup & Tanda Tangan

Gunakan bahasa formal hukum Indonesia yang jelas dan mudah dipahami. Output dalam format Markdown."""

        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            return Response({'error': 'Groq API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            resp = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json',
                },
                json={
                    'model': 'llama-3.3-70b-versatile',
                    'messages': [
                        {'role': 'system', 'content': 'Kamu adalah ahli hukum kontrak Indonesia yang berpengalaman membuat kontrak kerja freelance.'},
                        {'role': 'user', 'content': prompt}
                    ],
                    'temperature': 0.3,
                    'max_tokens': 4000,
                },
                timeout=60,
            )

            if resp.status_code != 200:
                return Response({'error': f'Groq API error: {resp.text}'}, status=status.HTTP_502_BAD_GATEWAY)

            content = resp.json()['choices'][0]['message']['content']

            contract = Contract.objects.create(
                user=user,
                invoice=invoice,
                title=f"Kontrak - {invoice.client_name} - {invoice.invoice_number}",
                client_name=invoice.client_name,
                content=content,
                status='draft',
            )

            return Response(ContractSerializer(contract).data, status=status.HTTP_201_CREATED)

        except requests.exceptions.Timeout:
            return Response({'error': 'AI generation timed out, please try again'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
