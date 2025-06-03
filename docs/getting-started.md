# Getting Started with Developer Capitalist

This guide will help you set up and run Developer Capitalist locally for development or personal use.

## Prerequisites

- Node.js 18+ or Bun 1.0+
- PostgreSQL database
- Backblaze B2 account (or any S3-compatible storage)

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/dev-cap.git
   cd dev-cap
   ```

2. Install dependencies
   ```bash
   bun install
   # or
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Then edit .env with your configuration
   ```

4. Set up the database
   ```bash
   bun prisma migrate dev
   bun prisma db seed
   ```

5. Start the development server
   ```bash
   bun dev
   # or
   npm run dev
   ```

## Configuration Options

### Environment Variables

The `.env` file contains all necessary configuration:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_URL`: The base URL of your application
- `NEXTAUTH_SECRET`: Secret for NextAuth.js (generate a random string)
- `S3_*`: Configuration for Backblaze B2 or other S3-compatible storage

For a complete list of environment variables, see the [.env.example](../.env.example) file.

## Deployment

For production deployment instructions, see the [deployment guide](./deployment.md).
