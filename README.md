# SaaS Budget - 50-30-20 Smart Budgeting PWA

A modern, sleek Progressive Web App (PWA) for budget management using the proven 50-30-20 budgeting rule. Built with React, Node.js, SQLite, and Docker.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Deploy with Docker Compose

To get the application up and running quickly, navigate to the project root directory and run:

```bash
docker compose up --build -d
```

This will build and start the client, server, and SQLite database services.

### 2. Access the Application

The client will be available on `http://localhost` (or the port defined by `CLIENT_PORT` in your `.env` file, default: 80).

### 3. Login
- **Default Admin Username**: `admin`
- **Default Admin Password**: `password` (Change this in your `.env` file for production!)
