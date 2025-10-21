#!/bin/sh
set -e

echo "Running Prisma migrations..."
yarn prisma:migrate

echo "Starting Next.js server..."
exec node server.js