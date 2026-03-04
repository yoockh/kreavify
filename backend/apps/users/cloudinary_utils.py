import cloudinary
import cloudinary.uploader
import os
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

# Parse Cloudinary credentials from env
_api_key_env = os.getenv('CLOUDINARY_API_KEY', '')
_cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME', '')
_api_secret = os.getenv('CLOUDINARY_API_SECRET', '')

if '://' in _api_key_env:
    # Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    parsed = urlparse(_api_key_env)
    _cloud_name = parsed.hostname or _cloud_name
    _api_key = parsed.username or ''
    _api_secret = parsed.password or _api_secret
else:
    _api_key = _api_key_env

cloudinary.config(
    cloud_name=_cloud_name,
    api_key=_api_key,
    api_secret=_api_secret,
)


def upload_image(file, folder='kreavify'):
    """Upload an image file to Cloudinary and return the secure URL."""
    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        resource_type='image',
        transformation=[
            {'width': 1200, 'crop': 'limit'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    return result.get('secure_url', '')
