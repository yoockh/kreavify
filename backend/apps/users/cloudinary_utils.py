import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '').split(':')[0] if '://' not in os.getenv('CLOUDINARY_API_KEY', '') else None,
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
)

# If CLOUDINARY_API_KEY is a full URL like cloudinary://key:secret@cloud, parse it
_api_key = os.getenv('CLOUDINARY_API_KEY', '')
if '://' in _api_key:
    # Use CLOUDINARY_URL style
    os.environ['CLOUDINARY_URL'] = _api_key
    cloudinary.config()


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
