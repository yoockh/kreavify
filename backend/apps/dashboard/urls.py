from django.urls import path
from .views import DashboardView
from .tax_views import TaxReportView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('tax-report/', TaxReportView.as_view(), name='tax_report'),
]
