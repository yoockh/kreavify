import os
import requests
import json

def get_pricing_suggestion(service_description, target_market="UMKM Indonesia", complexity="menengah", language="id"):
    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        raise Exception("GROQ_API_KEY is not configured.")
        
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    if language == 'en':
        prompt = f"""You are a pricing consultant for creative services in Indonesia.

The user describes their service as: "{service_description}"
Target market: "{target_market}"
Complexity: "{complexity}"

Use your REAL-TIME WEB SEARCH capabilities to find the most current and accurate market rates for this specific service.
Give a FAIR price estimate for the Indonesian market.
Consider:
- Real-time market data and standard prices for creative services in Indonesia (Search the web for 2025-2026 data)
- Do not make it too cheap (avoid underpricing that hurts creators)
- Do not make it too expensive (must be competitive)
- The range should be reasonable (max about 2-3x of min)

Reply ONLY in valid JSON format without extra text, following this template:
{{
  "suggested_min": <number in IDR>,
  "suggested_max": <number in IDR>,
  "explanation": "<short explanation of why this range based on your real-time search in English>",
  "factors": ["<factor 1 from search>", "<factor 2>", "<factor 3>"]
}}
"""
        sys_msg = "You are a professional pricing consultant for creative services in Indonesia with access to real-time internet search. You MUST use your search tools to find current prices. Respond strictly in valid JSON in English."
    else:
        prompt = f"""Kamu adalah konsultan pricing untuk jasa kreatif di Indonesia.

User mendeskripsikan jasanya: "{service_description}"
Target market: "{target_market}"
Kompleksitas: "{complexity}"

Gunakan kemampuan PENCARIAN WEB REAL-TIME kamu untuk mencari data harga pasar terbaru untuk jasa spesifik ini.
Berikan estimasi harga yang WAJAR untuk pasar Indonesia.
Pertimbangkan:
- Data pasar real-time dan standar harga jasa kreatif di Indonesia (Cari di internet untuk data 2025-2026)
- Jangan terlalu murah (hindari underprice yang merugikan kreator)
- Jangan terlalu mahal (harus kompetitif)
- Range yang masuk akal (max sekitar 2-3x dari min)

Balas hanya dalam format JSON valid tanpa text tambahan, berikut template-nya:
{{
  "suggested_min": <number dalam IDR>,
  "suggested_max": <number dalam IDR>,
  "explanation": "<penjelasan rasional kenapa range ini didasarkan pada pencarian real-time kamu (bahasa indonesia)>",
  "factors": ["<faktor 1 dari pencarian>", "<faktor 2>", "<faktor 3>"]
}}
"""
        sys_msg = "You are a professional pricing consultant for creative services in Indonesia with access to real-time internet search. You MUST use your search tools to find current prices. Respond strictly in valid JSON in Indonesian language."

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "groq/compound",
        "messages": [
            {"role": "system", "content": sys_msg},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_completion_tokens": 1024,
        "response_format": {"type": "json_object"},
        "compound_custom": {
            "tools": {
                "enabled_tools": ["web_search", "code_interpreter", "visit_website"]
            }
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    data = response.json()
    content = data['choices'][0]['message']['content']
    
    try:
        result = json.loads(content)
        return result
    except json.JSONDecodeError:
        raise Exception("Failed to parse JSON from AI response")
