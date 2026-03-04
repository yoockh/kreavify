from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from .models import ProfileView, ServiceClick
from apps.users.models import User
from apps.services.models import Service


class RecordProfileView(APIView):
    """Public endpoint — records a profile view (no auth needed)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        slug = request.data.get('slug')
        if not slug:
            return Response({'error': 'slug required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(slug=slug)
        except User.DoesNotExist:
            return Response({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)

        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
        if ',' in ip:
            ip = ip.split(',')[0].strip()

        # Prevent spam: max 1 view per IP per hour
        one_hour_ago = timezone.now() - timedelta(hours=1)
        if not ProfileView.objects.filter(user=user, viewer_ip=ip, created_at__gte=one_hour_ago).exists():
            ProfileView.objects.create(
                user=user,
                viewer_ip=ip,
                referrer=request.data.get('referrer', '')
            )

        return Response({'status': 'ok'})


class RecordServiceClick(APIView):
    """Public endpoint — records a service click."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        service_id = request.data.get('service_id')
        if not service_id:
            return Response({'error': 'service_id required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({'error': 'service not found'}, status=status.HTTP_404_NOT_FOUND)

        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
        if ',' in ip:
            ip = ip.split(',')[0].strip()

        one_hour_ago = timezone.now() - timedelta(hours=1)
        if not ServiceClick.objects.filter(service=service, viewer_ip=ip, created_at__gte=one_hour_ago).exists():
            ServiceClick.objects.create(service=service, viewer_ip=ip)

        return Response({'status': 'ok'})


class AnalyticsStatsView(APIView):
    """Authenticated endpoint — returns analytics data for the logged-in user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        # Total views
        total_views = ProfileView.objects.filter(user=user).count()

        # Last 7 days views
        seven_days_ago = now - timedelta(days=7)
        views_7d = ProfileView.objects.filter(user=user, created_at__gte=seven_days_ago).count()

        # Daily views for chart (last 7 days)
        daily_views = (
            ProfileView.objects.filter(user=user, created_at__gte=seven_days_ago)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        # Fill in missing days
        chart_data = []
        for i in range(7):
            date = (now - timedelta(days=6 - i)).date()
            count = 0
            for entry in daily_views:
                if entry['date'] == date:
                    count = entry['count']
                    break
            chart_data.append({
                'date': date.strftime('%d %b'),
                'views': count
            })

        # Service clicks
        user_services = Service.objects.filter(user=user)
        total_clicks = ServiceClick.objects.filter(service__in=user_services).count()
        clicks_7d = ServiceClick.objects.filter(
            service__in=user_services, created_at__gte=seven_days_ago
        ).count()

        # Top services by clicks
        top_services = (
            ServiceClick.objects.filter(service__in=user_services)
            .values('service__title')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
        )

        return Response({
            'total_views': total_views,
            'views_last_7_days': views_7d,
            'total_clicks': total_clicks,
            'clicks_last_7_days': clicks_7d,
            'daily_views_chart': chart_data,
            'top_services': list(top_services),
        })
