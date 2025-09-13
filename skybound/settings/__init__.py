"""
Settings package for Skybound Academy project.
"""
import os

# Determine which settings to use based on environment
ENVIRONMENT = os.environ.get('DJANGO_ENVIRONMENT', 'development')

if ENVIRONMENT == 'production':
    from .production import *
elif ENVIRONMENT == 'staging':
    from .production import *  # Use production settings for staging with some overrides
else:
    from .development import *