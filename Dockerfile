# Build stage
FROM node:18-alpine AS builder

# Copy backend directory entirely
COPY backend /app

WORKDIR /app

# Install dependencies
RUN npm install --production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the server
CMD ["npm", "start"]
