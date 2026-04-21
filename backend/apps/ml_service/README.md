# ML Service - AI Financial Intelligence

## Setup

1. Install ML dependencies:
```bash
pip install -r requirements-ml.txt
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Generate demo data (optional):
```bash
python manage.py generate_demo_data --user-email=your@email.com --months=6
```

## API Endpoints

### 1. Revenue Forecast
**GET** `/api/ml/revenue-forecast/`

Prediksi pendapatan bulan depan berdasarkan histori invoice.

Response:
```json
{
  "success": true,
  "predicted_amount": 4200000,
  "confidence_score": 0.85,
  "lower_bound": 3360000,
  "upper_bound": 5040000,
  "forecast_month": "2025-02",
  "insights": {
    "trend": "turun",
    "change_percentage": 15.5,
    "avg_projects_per_month": 3.2,
    "message": "Pendapatan bulan depan diprediksi Rp 4.200.000 (turun 15%). Pertimbangkan untuk mencari klien baru."
  }
}
```

### 2. Pricing Recommendation
**POST** `/api/ml/pricing-recommendation/`

Rekomendasi harga berdasarkan kategori service dan kompleksitas.

Request:
```json
{
  "service_category": "logo",
  "complexity": "medium"
}
```

Response:
```json
{
  "min_price": 1050000,
  "optimal_price": 1500000,
  "max_price": 2250000,
  "experience_level": "mid",
  "complexity": "medium",
  "sample_size": 45,
  "data_source": "calculated"
}
```

### 3. Pricing Analysis
**POST** `/api/ml/pricing-analysis/`

Analisis apakah harga user underprice/overprice.

Request:
```json
{
  "service_category": "logo",
  "user_price": 1000000
}
```

Response:
```json
{
  "status": "underprice",
  "user_price": 1000000,
  "market_optimal": 1500000,
  "difference": -500000,
  "difference_percentage": -33.3,
  "message": "Harga Anda Rp 500.000 lebih rendah dari pasar. Pertimbangkan untuk menaikkan harga.",
  "market_range": {
    "min_price": 1050000,
    "optimal_price": 1500000,
    "max_price": 2250000
  }
}
```

### 4. Dashboard Insights (Combined)
**GET** `/api/ml/dashboard-insights/`

Gabungan semua insights untuk dashboard.

Response:
```json
{
  "revenue_forecast": { ... },
  "pricing_insights": [
    {
      "service_id": 1,
      "service_title": "Logo Design Premium",
      "category": "logo",
      "analysis": { ... }
    }
  ],
  "total_potential_increase": 1500000,
  "experience_level": "mid"
}
```

## ML Models

### 1. Revenue Forecaster
- **Algorithm**: Simple Moving Average (3-month window)
- **Input**: Historical paid invoices (6 months)
- **Output**: Next month revenue prediction + confidence score
- **Future**: Upgrade to LSTM/Prophet for better accuracy

### 2. Pricing Engine
- **Algorithm**: Statistical analysis + rule-based
- **Data Sources**: 
  - Platform invoice data (anonymized)
  - Default pricing matrix
- **Features**: Experience level, service category, complexity
- **Future**: XGBoost model with more features

## Data Requirements

Minimum data untuk ML predictions:
- **Revenue Forecast**: 2 bulan histori invoice terbayar
- **Pricing Analysis**: Langsung available (pakai default pricing)

## Future Enhancements

1. **LSTM Model** untuk revenue forecasting yang lebih akurat
2. **XGBoost** untuk dynamic pricing dengan lebih banyak features
3. **Client Risk Scoring** (prediksi klien yang bayar telat)
4. **Cash Flow Advisor** (early warning system)
5. **Market Intelligence** (trend analysis)
