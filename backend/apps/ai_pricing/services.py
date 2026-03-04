import os
import requests
import json

def get_pricing_suggestion(service_description, target_market="UMKM Indonesia", complexity="menengah"):
    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        raise Exception("GROQ_API_KEY is not configured.")
        
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    prompt = f"""Kamu adalah konsultan pricing untuk jasa kreatif di Indonesia.

User mendeskripsikan jasanya: "{service_description}"
Target market: "{target_market}"
Kompleksitas: "{complexity}"

Berikan estimasi harga yang WAJAR untuk pasar Indonesia.
Pertimbangkan:
- Standar harga jasa kreatif di Indonesia 2025-2026
- Jangan terlalu murah (hindari underprice yang merugikan kreator)
- Jangan terlalu mahal (harus kompetitif)
- Range yang masuk akal (max sekitar 2-3x dari min)

Balas hanya dalam format JSON valid tanpa text tambahan, berikut template-nya:
{{
  "suggested_min": <number dalam IDR>,
  "suggested_max": <number dalam IDR>,
  "explanation": "<penjelasan singkat kenapa range ini (bahasa indonesia)>",
  "factors": ["<faktor 1>", "<faktor 2>", "<faktor 3>"]
}}
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a professional pricing consultant for creative services in Indonesia. Respond strictly in JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 500,
        "response_format": {"type": "json_object"}
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
