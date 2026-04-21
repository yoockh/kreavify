from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils import timezone
from datetime import datetime
from dateutil.relativedelta import relativedelta

from .ml_models.revenue_forecaster import RevenueForecaster
from .ml_models.pricing_engine import PricingEngine
from apps.analytics.models import RevenueForecast


class RevenueForecastView(APIView):
    """API endpoint for revenue forecasting"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get revenue forecast for next month"""
        user = request.user
        
        # Check if we have recent forecast (cache for 24 hours)
        if user.last_forecast_date:
            hours_since_last = (timezone.now() - user.last_forecast_date).total_seconds() / 3600
            if hours_since_last < 24 and user.last_revenue_forecast:
                return Response({
                    'cached': True,
                    **user.last_revenue_forecast
                })
        
        # Generate new forecast
        forecaster = RevenueForecaster(user)
        result = forecaster.predict_next_month()
        
        if result['success']:
            # Save to database
            forecast_month = datetime.strptime(result['forecast_month'], '%Y-%m').date()
            
            RevenueForecast.objects.update_or_create(
                user=user,
                forecast_month=forecast_month,
                defaults={
                    'predicted_amount': result['predicted_amount'],
                    'confidence_score': result['confidence_score'],
                    'lower_bound': result['lower_bound'],
                    'upper_bound': result['upper_bound'],
                    'insights': result['insights']
                }
            )
            
            # Cache in user model
            user.last_revenue_forecast = result
            user.last_forecast_date = timezone.now()
            user.save()
        
        return Response(result)


class PricingRecommendationView(APIView):
    """API endpoint for pricing recommendations"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Get pricing recommendation for a service"""
        service_category = request.data.get('service_category')
        complexity = request.data.get('complexity', 'medium')
        
        if not service_category:
            return Response(
                {'detail': 'service_category is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        engine = PricingEngine(request.user)
        recommendation = engine.get_pricing_recommendation(service_category, complexity)
        
        return Response(recommendation)


class PricingAnalysisView(APIView):
    """API endpoint to analyze user's current pricing"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Analyze if user is underpricing or overpricing"""
        service_category = request.data.get('service_category')
        user_price = request.data.get('user_price')
        
        if not service_category or not user_price:
            return Response(
                {'detail': 'service_category and user_price are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_price = float(user_price)
        except (ValueError, TypeError):
            return Response(
                {'detail': 'user_price must be a number'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        engine = PricingEngine(request.user)
        analysis = engine.analyze_user_pricing(service_category, user_price)
        
        return Response(analysis)


class DashboardInsightsView(APIView):
    """Combined insights for dashboard"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get all ML insights for dashboard"""
        user = request.user
        
        # Revenue forecast
        forecaster = RevenueForecaster(user)
        revenue_forecast = forecaster.predict_next_month()
        
        # Get user's services for pricing analysis
        from apps.services.models import Service
        services = Service.objects.filter(user=user, is_active=True)[:3]
        
        pricing_insights = []
        engine = PricingEngine(user)
        
        for service in services:
            analysis = engine.analyze_user_pricing(service.category, float(service.base_price))
            pricing_insights.append({
                'service_id': service.id,
                'service_title': service.title,
                'category': service.category,
                'analysis': analysis
            })
        
        # Calculate total potential revenue increase
        total_potential_increase = sum(
            max(0, insight['analysis']['difference']) 
            for insight in pricing_insights 
            if insight['analysis']['status'] == 'underprice'
        )
        
        return Response({
            'revenue_forecast': revenue_forecast,
            'pricing_insights': pricing_insights,
            'total_potential_increase': int(total_potential_increase),
            'experience_level': engine.get_experience_level(),
        })
