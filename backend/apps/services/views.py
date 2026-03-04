from rest_framework import generics, permissions
from .models import Service, PortfolioItem
from .serializers import ServiceSerializer, PortfolioItemSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Service.objects.filter(user=self.request.user)

class PortfolioListCreateView(generics.ListCreateAPIView):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PortfolioItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PortfolioDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return PortfolioItem.objects.filter(user=self.request.user)
