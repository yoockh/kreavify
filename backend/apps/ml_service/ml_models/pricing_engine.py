"""
Dynamic Pricing Engine using market data and user profile
"""
from django.db.models import Avg, Count
from apps.invoices.models import Invoice
from apps.services.models import Service
from apps.ai_pricing.models import MarketPricing


class PricingEngine:
    """AI-powered pricing recommendations"""
    
    EXPERIENCE_MAPPING = {
        0: 'junior',
        1: 'junior',
        2: 'mid',
        3: 'mid',
        4: 'mid',
        5: 'senior',
    }
    
    def __init__(self, user):
        self.user = user
    
    def get_experience_level(self):
        """Determine user experience level"""
        years = self.user.experience_years
        if years >= 5:
            return 'senior'
        elif years >= 2:
            return 'mid'
        else:
            return 'junior'
    
    def get_market_rate(self, service_category):
        """Get market rate from database or calculate from platform data"""
        experience_level = self.get_experience_level()
        
        # Try to get from cache
        try:
            market_data = MarketPricing.objects.get(
                service_category=service_category,
                experience_level=experience_level
            )
            return {
                'min_price': float(market_data.min_price),
                'optimal_price': float(market_data.optimal_price),
                'max_price': float(market_data.max_price),
                'sample_size': market_data.sample_size,
                'source': 'cached'
            }
        except MarketPricing.DoesNotExist:
            # Calculate from platform data
            return self._calculate_market_rate(service_category, experience_level)
    
    def _calculate_market_rate(self, service_category, experience_level):
        """Calculate market rate from platform invoices"""
        # Get all paid invoices for this service category
        services = Service.objects.filter(
            category=service_category,
            is_active=True
        ).values_list('id', flat=True)
        
        invoices = Invoice.objects.filter(
            status='paid',
            items__isnull=False
        )
        
        # Extract prices from invoice items
        prices = []
        for invoice in invoices:
            for item in invoice.items:
                if 'unit_price' in item:
                    prices.append(float(item['unit_price']))
        
        if not prices or len(prices) < 3:
            # Fallback to default pricing
            return self._get_default_pricing(service_category, experience_level)
        
        # Calculate statistics
        prices.sort()
        min_price = prices[int(len(prices) * 0.25)]  # 25th percentile
        optimal_price = sum(prices) / len(prices)  # Mean
        max_price = prices[int(len(prices) * 0.75)]  # 75th percentile
        
        # Apply experience multiplier
        multipliers = {'junior': 0.7, 'mid': 1.0, 'senior': 1.5}
        multiplier = multipliers.get(experience_level, 1.0)
        
        return {
            'min_price': int(min_price * multiplier),
            'optimal_price': int(optimal_price * multiplier),
            'max_price': int(max_price * multiplier),
            'sample_size': len(prices),
            'source': 'calculated'
        }
    
    def _get_default_pricing(self, service_category, experience_level):
        """Default pricing when no data available"""
        # Base prices per category (in IDR)
        base_prices = {
            'logo': 1500000,
            'branding': 5000000,
            'social_media': 500000,
            'illustration': 2000000,
            'photo_product': 1000000,
            'photo_event': 3000000,
            'video_promo': 5000000,
            'video_event': 7000000,
            'copywriting': 800000,
            'translation': 600000,
            'music': 3000000,
            'web_dev': 10000000,
            'other': 1000000,
        }
        
        base = base_prices.get(service_category, 1000000)
        
        # Experience multipliers
        multipliers = {'junior': 0.7, 'mid': 1.0, 'senior': 1.5}
        multiplier = multipliers.get(experience_level, 1.0)
        
        optimal = int(base * multiplier)
        
        return {
            'min_price': int(optimal * 0.7),
            'optimal_price': optimal,
            'max_price': int(optimal * 1.5),
            'sample_size': 0,
            'source': 'default'
        }
    
    def analyze_user_pricing(self, service_category, user_price):
        """Analyze if user is underpricing or overpricing"""
        market_rate = self.get_market_rate(service_category)
        optimal = market_rate['optimal_price']
        
        difference = user_price - optimal
        difference_pct = (difference / optimal * 100) if optimal > 0 else 0
        
        if difference_pct < -20:
            status = 'underprice'
            message = f"Harga Anda Rp {abs(difference):,.0f} lebih rendah dari pasar. Pertimbangkan untuk menaikkan harga.".replace(',', '.')
        elif difference_pct > 20:
            status = 'overprice'
            message = f"Harga Anda Rp {difference:,.0f} lebih tinggi dari pasar. Pastikan value proposition Anda jelas.".replace(',', '.')
        else:
            status = 'optimal'
            message = "Harga Anda sudah sesuai dengan pasar."
        
        return {
            'status': status,
            'user_price': user_price,
            'market_optimal': optimal,
            'difference': int(difference),
            'difference_percentage': round(difference_pct, 1),
            'message': message,
            'market_range': market_rate
        }
    
    def get_pricing_recommendation(self, service_category, complexity='medium'):
        """Get pricing recommendation for a service"""
        market_rate = self.get_market_rate(service_category)
        
        # Adjust for complexity
        complexity_multipliers = {
            'simple': 0.8,
            'medium': 1.0,
            'complex': 1.3
        }
        multiplier = complexity_multipliers.get(complexity, 1.0)
        
        recommended = {
            'min_price': int(market_rate['min_price'] * multiplier),
            'optimal_price': int(market_rate['optimal_price'] * multiplier),
            'max_price': int(market_rate['max_price'] * multiplier),
            'experience_level': self.get_experience_level(),
            'complexity': complexity,
            'sample_size': market_rate['sample_size'],
            'data_source': market_rate['source']
        }
        
        return recommended
