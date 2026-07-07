# =====================================================================
#  OMEGA CORE RUNTIME BUILD RECIPE (MULTI-STAGE DOCKERFILE)
# =====================================================================

# Stage 1: Native Build & Compilation
FROM node:22-alpine AS builder
WORKDIR /app

# Install package dependencies
COPY package*.json ./
RUN npm ci

# Copy full-stack codebase & compile frontend and backend bundles
COPY . .
RUN npm run build

# Stage 2: Production Container Assembly
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only lightweight production packages
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled artifacts from the builder environment
COPY --from=builder /app/dist ./dist

# Expose single ingress reverse-proxy compatible port
EXPOSE 3000

# Fire up compiled Node-Express ESM / CommonJS server
CMD ["npm", "run", "start"]
