from django.urls import path
from .views import PublicPaymentInvoiceView, CheckoutView, MidtransWebhookView, ManualPaymentSyncView

urlpatterns = [
    path('notification/', MidtransWebhookView.as_view(), name='midtrans_webhook'),
    path('<slug:slug>/', PublicPaymentInvoiceView.as_view(), name='payment_invoice_detail'),
    path('<slug:slug>/checkout/', CheckoutView.as_view(), name='payment_checkout'),
    path('<slug:slug>/sync/', ManualPaymentSyncView.as_view(), name='payment_sync'),
]
