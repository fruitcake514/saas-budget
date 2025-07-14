# SaaS Budget - 50-30-20 Smart Budgeting PWA

A modern, sleek Progressive Web App (PWA) for budget management using the proven 50-30-20 budgeting rule. Built with React, Node.js, SQLite, and Docker.

![SaaS Budget](https://img.shields.io/badge/SaaS-Budget-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)
![PWA](https://img.shields.io/badge/PWA-Enabled-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

### 🎯 **Core Budgeting**
- **50-30-20 Rule Implementation**: Automatic categorization (50% Needs, 30% Wants, 20% Savings)
- **User-Defined Budget Items**: Create and allocate funds to specific items within categories (e.g., Rent, Groceries)
- **Zero-Sum Budget**: Real-time balance tracking (Income - Expenses)
- **Multiple Budgets**: Create and manage multiple budget scenarios
- **Budget Sharing**: Collaborate with others on shared budgets

### 💰 **Financial Management**
- **Income Tracking**: Add monthly/regular income entries
- **Expense Tracking**: Categorized expense entry with descriptions, linked to budget items
- **CSV Import for Expenses**: Bulk import expenses from CSV files with specified columns
- **Transaction History**: Complete history of all financial entries
- **Transaction Editing/Deletion**: Full CRUD operations for income and expenses
- **Budget Health**: Real-time indicators showing budget status

### 📊 **Data Visualization & Reporting**
- **Interactive Charts**: Mobile-responsive doughnut charts for budget breakdown
- **Progress Indicators**: Visual progress bars for each category and individual budget item
- **Dashboard Analytics**: Comprehensive financial overview
- **Detailed Expense Reports**: Generate 30-day reports with individual expense items
- **Mobile-Optimized Reports**: Card-based expense reports with expandable details on mobile
- **CSV Export for Reports**: Export detailed expense reports to CSV
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

### 🔐 **User Management**
- **JWT Authentication**: Secure token-based authentication
- **User Roles**: Admin and regular user permissions
- **Multi-User Support**: Multiple users with private budgets
- **Admin Panel**: User creation and management

### 🎨 **Modern UI/UX**
- **Dark Theme**: Sleek, modern dark interface with gradient backgrounds
- **PWA Support**: Full Progressive Web App with offline capabilities and native app feel
- **Material Design**: Beautiful, intuitive user interface with Material-UI components
- **Mobile-First Design**: Touch-optimized interface with proper accessibility
- **Responsive Layout**: Adaptive layouts for mobile, tablet, and desktop
- **Smart Install Prompts**: Platform-aware PWA installation guidance
- **Floating Action Buttons**: Quick access to common actions on mobile

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Deploy with Docker Compose

To get the application up and running quickly, you can use Docker Compose to build and run all services directly from the GitHub repository. **You do not need to clone the repository first.**

```bash
# Navigate to the directory where you want to store the docker-compose.yml file
# (e.g., your home directory or a dedicated projects folder)
cd /path/to/your/desired/directory

# Download the docker-compose.yml file
curl -O https://raw.githubusercontent.com/your-username/saas-budget/main/docker-compose.yml

# Create a .env file from the example (important for configuration)
curl -O https://raw.githubusercontent.com/your-username/saas-budget/main/.env.example
mv .env.example .env
# IMPORTANT: Edit the .env file to set your desired passwords and JWT_SECRET
# nano .env or open with your preferred text editor

# Start the application services
docker compose up --build -d

# Access the application
# The client will be available on the port defined by CLIENT_PORT in your .env (default: 80)
open http://localhost
```

**Note:** Replace `https://raw.githubusercontent.com/your-username/saas-budget/main/docker-compose.yml` and `https://raw.githubusercontent.com/your-username/saas-budget/main/.env.example` with the actual raw file URLs from your GitHub repository. Also, ensure your repository is public or Docker has the necessary credentials to access it.

### 2. Login
- **Default Admin Username**: `admin`
- **Default Admin Password**: `password` (Change this in your `.env` file for production!)

## 📋 Detailed Setup

### Environment Configuration
The application uses environment variables for configuration. These are typically defined in a `.env` file in the same directory as `docker-compose.yml`. A `.env.example` is provided.

```env
# Database Configuration
DB_USER=user
DB_HOST=db
DB_DATABASE=saasbudget.db
DB_PASSWORD=password123
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Admin User (Default credentials for initial setup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password

# Port Configuration
SERVER_PORT=5000
CLIENT_PORT=80
```

### Docker Deployment

#### Building and Running from GitHub (Recommended)
To build and run the application directly from your GitHub repository, ensure your `docker-compose.yml` has the `context` set to your GitHub repository URL (as updated in the previous step).

```bash
# Navigate to the directory containing your docker-compose.yml and .env files
cd /path/to/your/project

# Build and start all services (this will pull from GitHub)
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

#### Local Development (if you have the repository cloned)
If you have the repository cloned locally and want to build from local files, you can revert the `context` in `docker-compose.yml` to `./server` and `./client` respectively.

```bash
# Clone repository (if not already cloned)
git clone <your-repo-url>
cd saas-budget

# Build and start all services from local files
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

#### Production Deployment
```bash
# Ensure your docker-compose.yml is configured to pull from GitHub or your local clone is up-to-date
# Update environment variables for production in your .env file
# Edit .env with your production values (especially JWT_SECRET, ADMIN_PASSWORD, and DB credentials)

# Deploy with Docker Compose
docker compose up -d --build

# Check status
docker compose ps
```

## 🏗️ Architecture

### Services
- **Frontend**: React PWA with Material-UI (Port 80)
- **Backend**: Node.js/Express REST API (Port 5000)
- **Database**: SQLite with persistent volumes
- **Reverse Proxy**: Nginx for serving React build

### Tech Stack
```
Frontend:
├── React 18
├── Material-UI (MUI) with responsive design
├── Chart.js with mobile optimization
├── Axios for API communication
├── JWT Decode for authentication
├── Advanced PWA support with service workers
├── Custom hooks for PWA install detection
└── Mobile-first responsive design

Backend:
├── Node.js
├── Express.js
├── SQLite
├── JWT Authentication
├── bcrypt for password security
├── CORS configuration
└── RESTful API design

Infrastructure:
├── Docker & Docker Compose
├── Nginx for production serving
├── SQLite with persistent volumes
├── Multi-stage Docker builds
└── Production-ready deployment
```

## 📱 PWA Features

### Installation
1. Visit the app in a modern browser (Chrome, Edge, Safari, Firefox)
2. Look for the install icon in the app header or browser prompt
3. Click "Install App" to add to home screen/desktop
4. App runs like a native application with custom app icon

### Advanced PWA Capabilities
- **Smart Offline Support**: Advanced service worker with API caching and offline fallbacks
- **Native App Experience**: Standalone display mode with custom splash screen
- **Platform Detection**: Automatic platform-specific installation instructions
- **App Shortcuts**: Quick actions available from home screen/app launcher
- **Background Sync**: Automatic data synchronization when connection returns
- **Share Target**: Receive shared content from other apps (budget notes, receipts)
- **Push Notifications**: Ready for budget alerts and reminders (future feature)
- **Fast Loading**: Aggressive caching strategy for instant app startup
- **Mobile Optimizations**: Touch targets, safe area handling, and gesture support

## 🔧 API Documentation

### Authentication
```bash
# Login
POST /api/users/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}

# Response
{
  "token": "jwt_token_here"
}
```

### Budget Management
```bash
# Get all budgets
GET /api/budgets
Headers: { "x-auth-token": "jwt_token" }

# Create budget
POST /api/budgets
Headers: { "x-auth-token": "jwt_token" }
Content-Type: application/json

{
  "budget_name": "Monthly Budget"
}
```

### Income & Expenses
```bash
# Add income
POST /api/income
Headers: { "x-auth-token": "jwt_token" }
Content-Type: application/json

{
  "budget_id": 1,
  "amount": 5000,
  "income_date": "2025-01-01"
}

# Add expense
POST /api/expenses
Headers: { "x-auth-token": "jwt_token" }
Content-Type: application/json

{
  "budget_id": 1,
  "category_id": 1,
  "amount": 1200,
  "description": "Rent",
  "expense_date": "2025-01-01",
  "budget_item_id": 101 # Optional: Link to a specific budget item
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth with expiration
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configured cross-origin policies
- **Input Validation**: Server-side validation and sanitization
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 🐳 Docker Configuration

### Services Overview
```yaml
services:
  # React Frontend (PWA)
  client:
    build: ./client
    ports: ["${CLIENT_PORT:-80}:80"]
    depends_on: [server]

  # Node.js Backend API
  server:
    build: ./server
    ports: ["${SERVER_PORT:-5000}:5000"]
    depends_on: [db]
    environment:
      - DB_HOST=db

  # SQLite Database
  db:
    image: nouchka/sqlite3-web
    environment:
      - SQLITE_DATABASE=saasbudget.db
    volumes:
      - ./data:/data
    healthcheck:
      test: ["CMD-SHELL", "ls /data/saasbudget.db"]
      interval: 5s
      timeout: 5s
      retries: 5
```

## 📊 Database Schema

### Tables
- **users**: User accounts and authentication
- **budgets**: Budget containers with ownership
- **user_budgets**: Budget sharing/access permissions
- **categories**: 50-30-20 category definitions
- **budget_items**: User-defined budget items with allocated amounts
- **income**: Income entries with dates
- **expenses**: Expense entries with categories, descriptions, and optional links to budget items

### 50-30-20 Categories (Pre-configured)
- **Needs (50%)**: Essential expenses (rent, utilities, groceries)
- **Wants (30%)**: Discretionary spending (entertainment, dining out)
- **Savings (20%)**: Emergency fund, debt payments, investments

## 🚀 Deployment Guide

### Local Development
```bash
# Clone repository
git clone <your-repo-url>
cd saas-budget

# Start with Docker (recommended)
docker compose up -d

# Or run manually
cd server && npm install && npm start  # Backend
cd client && npm install && npm start  # Frontend
```

### Production Deployment

#### Cloud Platforms
1. **DigitalOcean Droplet**
   ```bash
   # On your droplet
   git clone <repo-url>
   cd saas-budget
   docker compose up -d
   ```

2. **AWS EC2**
   ```bash
   # Install Docker on EC2
   sudo yum update -y
   sudo yum install docker -y
   sudo service docker start
   
   # Deploy app
   git clone <repo-url>
   cd saas-budget
   docker compose up -d
   ```

3. **Google Cloud Platform**
   ```bash
   # Use Google Cloud Run or Compute Engine
   gcloud compute instances create saas-budget-vm
   # SSH and deploy with Docker
   ```

#### Deployment Checklist
- [ ] Update `.env` with production values
- [ ] Change default admin password
- [ ] Configure SSL/HTTPS (use Certbot/Let's Encrypt)
- [ ] Set up database backups
- [ ] Configure monitoring (logs, uptime)
- [ ] Update JWT secret to secure random value
- [ ] Set up reverse proxy (Nginx/Apache) if needed
- [ ] Configure firewall rules

### SSL/HTTPS Setup (Production)
```bash
# Install Certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📱 Using the Application

### Getting Started
1. **Access the App**: Navigate to `http://localhost` (or your domain)
2. **Login**: Use `admin` / `password` for initial access
3. **Create Budget**: Click "New Budget" to create your first budget
4. **Add Income**: Go to "Transactions" → "Add Income" → Enter monthly income
5. **Add Expenses**: Click "Add Expense" → Select category → Enter details
6. **Monitor Progress**: View "Overview" for 50-30-20 breakdown

### PWA Installation
1. **Chrome/Edge**: Look for install icon in the app header or browser prompt
2. **Safari**: Share menu → "Add to Home Screen"
3. **Firefox**: Menu → "Install" or address bar icon
4. **Mobile**: Install prompt appears automatically, or use browser menu → "Add to Home Screen"
5. **Smart Prompts**: App provides platform-specific installation guidance

### Budget Management Tips
- **Set Monthly Income**: Add your total monthly income first
- **Categorize Expenses**: Properly categorize as Needs/Wants/Savings
- **Monitor Health**: Check budget health indicators regularly
- **Use Multiple Budgets**: Create separate budgets for different scenarios
- **Collaborate**: Share budgets with family members or partners

## 🛠️ Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check Docker status
docker compose ps

# Check logs
docker compose logs

# Restart services
docker compose restart
```

#### Database Connection Failed
```bash
# Check database logs
docker compose logs db

# Restart database
docker compose restart db

# Rebuild if needed
docker compose down
docker compose up --build
```

#### PWA Not Installing
- Ensure app is served over HTTPS (required for PWA in production)
- Check browser compatibility (Chrome, Edge, Safari, Firefox supported)
- Clear browser cache and reload
- Check manifest.json is accessible at `/manifest.json`
- Look for install icon in app header (not just browser address bar)
- Try manual installation via browser menu

#### Build Failures
```bash
# Clean rebuild
docker compose down -v
docker system prune -f
docker compose build --no-cache
docker compose up -d
```

### Performance Tips
- Use SSD storage for database volumes
- Configure database connection pooling
- Enable gzip compression
- Implement Redis caching for sessions
- Use CDN for static assets in production

## 📄 File Structure
```
saas-budget/
├── client/                 # React PWA Frontend
│   ├── public/
│   │   ├── manifest.json   # Enhanced PWA manifest with shortcuts
│   │   ├── service-worker.js # Advanced service worker with offline support
│   │   ├── offline.html    # Offline fallback page
│   │   ├── index.html
│   │   ├── favicon.ico     # App favicon
│   │   ├── logo192.png     # App icon (192x192)
│   │   └── logo512.png     # App icon (512x512)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── BudgetItemManager.js # Component for managing budget items
│   │   │   ├── CreateUserForm.js    # Component for creating users
│   │   │   ├── Dashboard.js         # Enhanced with PWA features
│   │   │   ├── ErrorBoundary.js     # Error handling component
│   │   │   ├── LoadingSpinner.js    # Mobile-optimized loading states
│   │   │   ├── Login.js
│   │   │   ├── PWAInstallPrompt.js  # Smart PWA installation component
│   │   │   └── Reports.js           # Mobile-optimized reports
│   │   ├── hooks/
│   │   │   └── usePWAInstall.js     # Custom hook for PWA detection
│   │   ├── App.js         # Main app with error boundaries
│   │   ├── App.css
│   │   ├── index.css      # Enhanced with mobile media queries
│   │   ├── index.js       # Service worker registration
│   │   └── ... (other React files)
│   ├── Dockerfile         # Client Docker config
│   └── package.json
├── server/                # Node.js Backend
│   ├── routes/           # API route handlers
│   │   ├── budgetItems.js  # New route for budget items
│   │   ├── expenses.js     # Updated for budget_item_id and CSV import
│   │   ├── reports.js      # Updated for detailed reports
│   │   └── ... (other routes)
│   ├── middleware/       # Auth middleware
│   ├── database.sql      # Database schema (updated)
│   ├── Dockerfile        # Server Docker config
│   └── package.json
├── docker-compose.yml    # Multi-service configuration
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Example environment variables
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Ensure Docker builds successfully
- Test PWA functionality

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/your-username/saas-budget/issues)
- 📖 **Documentation**: Check this README and inline code comments
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/saas-budget/discussions)

## 🔮 Roadmap

- [ ] **Mobile App**: React Native version
- [x] **Import/Export**: CSV data import/export for expenses
- [ ] **Notifications**: Budget alerts and reminders
- [ ] **Analytics**: Advanced spending analytics
- [ ] **Integrations**: Bank account integration
- [ ] **Multi-Currency**: Support for multiple currencies
- [ ] **Reports**: PDF budget reports
- [ ] **Goals**: Savings goals and tracking

---

**SaaS Budget** - Making personal finance management simple, visual, and effective with the proven 50-30-20 budgeting rule.

Built with ❤️ using React, Node.js, SQLite, and Docker.
