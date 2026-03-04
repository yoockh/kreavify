from django.urls import path
from .views import PublicPaymentInvoiceView, CheckoutView, MidtransWebhookView

urlpatterns = [
    path('notification/', MidtransWebhookView.as_view(), name='midtrans_webhook'),
    path('<slug:slug>/', PublicPaymentInvoiceView.as_view(), name='payment_invoice_detail'),
    path('<slug:slug>/checkout/', CheckoutView.as_view(), name='payment_checkout'),
]
