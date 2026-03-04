from django.urls import path
from .views import (
    InvoiceListCreateView, 
    InvoiceDetailView, 
    InvoiceSendView, 
    InvoiceCancelView
)

urlpatterns = [
    path('', InvoiceListCreateView.as_view(), name='invoice_list_create'),
    path('<uuid:pk>/', InvoiceDetailView.as_view(), name='invoice_detail'),
    path('<uuid:pk>/send/', InvoiceSendView.as_view(), name='invoice_send'),
    path('<uuid:pk>/cancel/', InvoiceCancelView.as_view(), name='invoice_cancel'),
]
