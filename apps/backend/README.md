# POS System - Backend API

## Overview
Express.js + TypeScript backend for the Customizable POS System.

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- npm/yarn

## Installation

```bash
cd apps/backend
npm install
```

## Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## Database

```bash
# Run migrations
npm run db:migrate

# Create new migration
npm run db:migrate:create

# Seed database
npm run db:seed
```

## API Documentation

API documentation is available at `/api/docs` (Swagger UI)

## Project Structure

```
src/
├── config/          # Configuration files
├── database/        # Database setup, migrations, seeders
├── middleware/      # Express middleware
├── modules/         # Feature modules (auth, transactions, etc.)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── server.ts       # Server entry point
```

## Environment Variables

See `.env.example` for all available configuration options.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

See main repository `/docs/DEPLOYMENT.md` for deployment instructions.
