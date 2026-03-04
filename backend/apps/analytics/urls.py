from django.urls import path
from .views import RecordProfileView, RecordServiceClick, AnalyticsStatsView

urlpatterns = [
    path('profile-view/', RecordProfileView.as_view()),
    path('service-click/', RecordServiceClick.as_view()),
    path('stats/', AnalyticsStatsView.as_view()),
]
