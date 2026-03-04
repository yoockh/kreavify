from django.urls import path
from .views import PortfolioListCreateView, PortfolioDetailView

urlpatterns = [
    path('', PortfolioListCreateView.as_view(), name='portfolio_list_create'),
    path('<int:pk>/', PortfolioDetailView.as_view(), name='portfolio_detail'),
]
