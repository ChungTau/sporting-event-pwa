#!/bin/sh
# Wait for PostgreSQL to be ready

./wait-for.sh fyp-db:5432 --timeout=30 -- echo "Database is up"

# Run Prisma migrations
npx prisma generate
npx prisma migrate deploy
npx prisma db push

# Start the Node.js server
exec node server.js
