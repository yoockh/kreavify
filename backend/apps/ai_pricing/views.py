from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils import timezone
from django.db.models import Count
from .services import get_pricing_suggestion
from .models import AIPricingUsage


class AIPricingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        service_description = request.data.get('service_description')
        target_market = request.data.get('target_market', 'UMKM Indonesia')
        complexity = request.data.get('complexity', 'menengah')

        if not service_description:
            return Response({"detail": "service_description is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check usage limit (3x/month free)
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        usage_count = AIPricingUsage.objects.filter(
            user=request.user,
            created_at__gte=month_start
        ).count()

        FREE_LIMIT = 3
        remaining = max(0, FREE_LIMIT - usage_count)

        if remaining <= 0:
            return Response({
                "detail": "Batas penggunaan AI gratis bulan ini sudah habis (3x/bulan).",
                "usage_count": usage_count,
                "remaining": 0,
                "limit": FREE_LIMIT,
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        try:
            result = get_pricing_suggestion(service_description, target_market, complexity)

            # Record usage
            AIPricingUsage.objects.create(user=request.user)

            remaining -= 1
            result['usage'] = {
                'used': usage_count + 1,
                'remaining': remaining,
                'limit': FREE_LIMIT,
            }

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AIPricingUsageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        usage_count = AIPricingUsage.objects.filter(
            user=request.user,
            created_at__gte=month_start,
        ).count()
        FREE_LIMIT = 3
        return Response({
            'used': usage_count,
            'remaining': max(0, FREE_LIMIT - usage_count),
            'limit': FREE_LIMIT,
        })
