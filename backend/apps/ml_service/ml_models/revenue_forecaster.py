"""
Simplified Revenue Forecasting using Prophet (easier than LSTM for MVP)
"""
import pandas as pd
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.db.models import Sum, Count
from apps.invoices.models import Invoice


class RevenueForecaster:
    """Simple revenue forecasting using historical patterns"""
    
    def __init__(self, user):
        self.user = user
    
    def get_historical_data(self, months=6):
        """Get historical invoice data"""
        end_date = datetime.now()
        start_date = end_date - relativedelta(months=months)
        
        invoices = Invoice.objects.filter(
            user=self.user,
            status='paid',
            paid_at__gte=start_date,
            paid_at__lte=end_date
        ).values('paid_at', 'total')
        
        if not invoices:
            return None
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(list(invoices))
        df['month'] = pd.to_datetime(df['paid_at']).dt.to_period('M')
        
        # Aggregate by month
        monthly_revenue = df.groupby('month')['total'].sum().reset_index()
        monthly_revenue['month'] = monthly_revenue['month'].dt.to_timestamp()
        
        return monthly_revenue
    
    def predict_next_month(self):
        """Predict revenue for next month using simple moving average"""
        historical = self.get_historical_data(months=6)
        
        if historical is None or len(historical) < 2:
            return {
                'success': False,
                'message': 'Tidak cukup data historis (minimal 2 bulan invoice terbayar)',
                'predicted_amount': 0,
                'confidence_score': 0,
            }
        
        # Simple moving average (last 3 months)
        recent_revenues = historical['total'].tail(3).values
        predicted = float(recent_revenues.mean())
        
        # Calculate confidence based on data consistency
        std_dev = float(recent_revenues.std())
        confidence = max(0.3, min(0.9, 1 - (std_dev / (predicted + 1))))
        
        # Calculate bounds (±20%)
        lower_bound = predicted * 0.8
        upper_bound = predicted * 1.2
        
        # Get insights
        avg_last_month = float(recent_revenues[-1])
        trend = "naik" if predicted > avg_last_month else "turun"
        change_pct = abs((predicted - avg_last_month) / avg_last_month * 100) if avg_last_month > 0 else 0
        
        # Count projects
        next_month_start = datetime.now().replace(day=1) + relativedelta(months=1)
        next_month_end = next_month_start + relativedelta(months=1)
        
        avg_projects = Invoice.objects.filter(
            user=self.user,
            status='paid',
            paid_at__gte=datetime.now() - relativedelta(months=3)
        ).count() / 3
        
        return {
            'success': True,
            'predicted_amount': int(predicted),
            'confidence_score': round(confidence, 2),
            'lower_bound': int(lower_bound),
            'upper_bound': int(upper_bound),
            'forecast_month': next_month_start.strftime('%Y-%m'),
            'insights': {
                'trend': trend,
                'change_percentage': round(change_pct, 1),
                'avg_projects_per_month': round(avg_projects, 1),
                'message': self._generate_message(predicted, avg_last_month, trend, change_pct)
            }
        }
    
    def _generate_message(self, predicted, last_month, trend, change_pct):
        """Generate human-readable insight message"""
        predicted_formatted = f"Rp {predicted:,.0f}".replace(',', '.')
        
        if trend == "turun" and change_pct > 20:
            return f"Pendapatan bulan depan diprediksi {predicted_formatted} (turun {change_pct:.0f}%). Pertimbangkan untuk mencari klien baru atau meningkatkan marketing."
        elif trend == "naik" and change_pct > 20:
            return f"Pendapatan bulan depan diprediksi {predicted_formatted} (naik {change_pct:.0f}%). Tren positif terdeteksi."
        else:
            return f"Pendapatan bulan depan diprediksi stabil di {predicted_formatted}."
