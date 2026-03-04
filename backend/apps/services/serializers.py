from rest_framework import serializers
from .models import Service, PortfolioItem

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'base_price', 'category', 'is_active', 'image_url', 'created_at']

class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'image_url', 'category', 'created_at']
