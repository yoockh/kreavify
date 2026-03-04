from rest_framework import serializers
from .models import Contract


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['id', 'title', 'client_name', 'content', 'status', 'invoice', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
