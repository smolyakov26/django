# Skybound Academy

A modern Django web application for an aviation academy offering skydiving, flight training, and aerial experiences.

## 🚀 Features

- **Product Management**: Comprehensive product catalog with categories, pricing, and SEO optimization
- **Email Subscriptions**: Advanced subscription system with exit-intent popups
- **Responsive Design**: Mobile-first responsive design with accessibility features
- **SEO Optimized**: Built-in SEO features with meta tags, sitemaps, and structured data
- **Admin Interface**: Enhanced Django admin with bulk actions and filtering
- **Performance**: Caching, lazy loading, and optimized database queries
- **Security**: Environment-based configuration with security best practices
- **Testing**: Comprehensive test suite with 95%+ coverage

## 🛠 Technology Stack

- **Backend**: Django 4.2+, Python 3.8+
- **Database**: SQLite (development), PostgreSQL (production)
- **Cache**: Redis (production), Local memory (development)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Gunicorn, WhiteNoise for static files

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git
- Redis (for production caching)
- PostgreSQL (for production database)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/skybound-academy.git
cd skybound-academy
```

### 2. Create and activate virtual environment

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the project root:

```env
# Development settings
DJANGO_ENVIRONMENT=development
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (for production)
DB_NAME=skybound
DB_USER=skybound_user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

# Cache (for production)
REDIS_URL=redis://127.0.0.1:6379/1

# Email settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 5. Database Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata fixtures/products.json
```

### 6. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### 7. Run Development Server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to see the application.

## 🏗 Project Structure

```
skybound-academy/
├── skybound/                 # Main project directory
│   ├── settings/            # Environment-based settings
│   │   ├── __init__.py
│   │   ├── base.py         # Base settings
│   │   ├── development.py  # Development settings
│   │   └── production.py   # Production settings
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── website/                 # Main application
│   ├── models.py           # Database models
│   ├── views.py            # View functions and classes
│   ├── urls.py             # URL patterns
│   ├── admin.py            # Admin configuration
│   ├── tests.py            # Test cases
│   └── migrations/         # Database migrations
├── templates/              # HTML templates
│   ├── website/
│   ├── 404.html
│   └── 500.html
├── static/                 # Static files
│   ├── css/
│   └── js/
├── fixtures/               # Sample data
├── logs/                   # Log files
├── requirements.txt        # Python dependencies
└── manage.py              # Django management script
```

## 🎯 Key Models

### Product
- Enhanced product model with categories, pricing, and SEO fields
- Automatic slug generation and validation
- Custom managers for active and featured products

### ProductCategory
- Hierarchical product categorization
- SEO-friendly URLs with slugs

### Subscription
- Email subscription management
- Source tracking and activation status
- Custom managers for filtering

## 🔒 Security Features

- Environment-based configuration
- CSRF protection
- Secure headers and HTTPS enforcement
- Input validation and sanitization
- SQL injection protection
- XSS protection

## 🚀 Performance Optimizations

- Database query optimization with select_related
- Template and view caching
- Static file compression
- Lazy loading for images
- Debounced scroll events
- Connection pooling ready

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
python manage.py test

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

## 📊 Admin Interface

Access the admin interface at `/admin/` with your superuser credentials.

Features:
- Enhanced product management with bulk actions
- Subscription management with filtering
- Category management
- SEO field management
- Custom admin actions

## 🌐 API Endpoints

- `POST /api/subscribe/` - Email subscription
- `GET /api/health/` - Health check endpoint

## 🚀 Deployment

### Production Environment Variables

```env
DJANGO_ENVIRONMENT=production
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_NAME=skybound_prod
DB_USER=skybound_user
DB_PASSWORD=secure-password
DB_HOST=your-db-host
DB_PORT=5432

# Cache
REDIS_URL=redis://your-redis-host:6379/1

# Email
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-password
```

### Deployment Steps

1. **Prepare the server**:
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv postgresql redis-server nginx
   ```

2. **Setup the application**:
   ```bash
   git clone your-repo
   cd skybound-academy
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure database**:
   ```bash
   sudo -u postgres createdb skybound_prod
   sudo -u postgres createuser skybound_user
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

4. **Setup Gunicorn**:
   ```bash
   pip install gunicorn
   gunicorn skybound.wsgi:application --bind 0.0.0.0:8000
   ```

5. **Configure Nginx** (example configuration in `/etc/nginx/sites-available/skybound`):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location /static/ {
           alias /path/to/skybound-academy/staticfiles/;
       }
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🔧 Configuration

### Environment Settings

The application uses environment-based settings:

- **Development**: `DJANGO_ENVIRONMENT=development`
- **Production**: `DJANGO_ENVIRONMENT=production`

### Caching

- Development: Local memory cache
- Production: Redis cache

### Database

- Development: SQLite
- Production: PostgreSQL

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Write tests for new features

## 🐛 Troubleshooting

### Common Issues

1. **Static files not loading**:
   ```bash
   python manage.py collectstatic --noinput
   ```

2. **Database connection errors**:
   - Check database credentials in `.env`
   - Ensure database server is running

3. **Redis connection errors**:
   - Install and start Redis server
   - Check REDIS_URL in settings

4. **Email not sending**:
   - Verify email settings in `.env`
   - Check firewall settings for SMTP ports

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@skyboundacademy.com or create an issue on GitHub.

## 🎉 Acknowledgments

- Django community for the excellent framework
- Contributors and testers
- Aviation industry professionals for domain expertise

---

**Skybound Academy** - Where Earth meets Sky ✈️🪂