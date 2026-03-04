from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import get_pricing_suggestion

class AIPricingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        service_description = request.data.get('service_description')
        target_market = request.data.get('target_market', 'UMKM Indonesia')
        complexity = request.data.get('complexity', 'menengah')
        
        if not service_description:
            return Response({"detail": "service_description is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            result = get_pricing_suggestion(service_description, target_market, complexity)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
