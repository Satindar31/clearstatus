#!/bin/sh

echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

echo "👥 Setting up monitor user accounts..."
yarn run setup:monitor-users

echo "🚀 Starting Next.js app..."
yarn start
