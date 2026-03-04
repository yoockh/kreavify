from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_440
from .models import Invoice
from .serializers import InvoiceSerializer
import os

from rest_framework.exceptions import PermissionDenied, ValidationError

class InvoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status', None)
        search_param = self.request.query_params.get('search', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if search_param:
            queryset = queryset.filter(client_name__icontains=search_param)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # Only allow update if draft
        if self.get_object().status != 'draft':
            raise ValidationError("Hanya invoice draft yang bisa diupdate.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.status != 'draft':
            raise ValidationError("Hanya invoice draft yang bisa dihapus.")
        instance.delete()

class InvoiceSendView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk, user=request.user)
        except Invoice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if invoice.status != 'draft':
            return Response({"detail": "Hanya draft yang bisa dikirim."}, status=status.HTTP_400_BAD_REQUEST)

        invoice.status = 'sent'
        invoice.save()
        
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        payment_url = f"{frontend_url}/pay/{invoice.slug}"
        
        return Response({
            "detail": "Invoice status updated to sent.",
            "payment_url": payment_url
        })

class InvoiceCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk, user=request.user)
        except Invoice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if invoice.status == 'paid':
            return Response({"detail": "Invoice yang sudah dibayar tidak bisa dibatalkan."}, status=status.HTTP_400_BAD_REQUEST)

        invoice.status = 'cancelled'
        invoice.save()
        
        return Response({"detail": "Invoice dibatalkan."}, status=status.HTTP_200_OK)
