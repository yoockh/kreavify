from django.urls import path
from .views import ContractListView, ContractDetailView, GenerateContractView

urlpatterns = [
    path('', ContractListView.as_view()),
    path('<uuid:pk>/', ContractDetailView.as_view()),
    path('generate/', GenerateContractView.as_view()),
]
