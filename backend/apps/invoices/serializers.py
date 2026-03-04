from rest_framework import serializers
from .models import Invoice
from apps.users.serializers import UserSerializer

class InvoiceSerializer(serializers.ModelSerializer):
    creator = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'client_name', 'client_email', 'client_phone',
            'items', 'subtotal', 'tax_percentage', 'tax_amount', 'total',
            'notes', 'status', 'due_date', 'paid_at', 'payment_method',
            'slug', 'created_at', 'updated_at', 'creator'
        ]
        read_only_fields = [
            'id', 'invoice_number', 'subtotal', 'tax_amount', 'total',
            'status', 'paid_at', 'payment_method', 'slug', 'created_at', 'updated_at', 'creator'
        ]

class PublicInvoiceSerializer(serializers.ModelSerializer):
    creator_display_name = serializers.CharField(source='user.display_name', read_only=True)
    creator_profession = serializers.CharField(source='user.profession', read_only=True)
    creator_bank_name = serializers.CharField(source='user.bank_name', read_only=True)
    creator_bank_account_number = serializers.CharField(source='user.bank_account_number', read_only=True)
    creator_bank_account_name = serializers.CharField(source='user.bank_account_name', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'client_name', 'client_email', 'client_phone',
            'items', 'subtotal', 'tax_percentage', 'tax_amount', 'total',
            'notes', 'status', 'due_date', 'paid_at', 'payment_method',
            'slug', 'created_at', 'creator_display_name', 'creator_profession',
            'creator_bank_name', 'creator_bank_account_number', 'creator_bank_account_name'
        ]
