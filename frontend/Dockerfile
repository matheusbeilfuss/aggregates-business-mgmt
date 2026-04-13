# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

# VITE_API_URL is baked at build time.
# With Nginx proxying /api/* -> backend, we set it to /api
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Runtime stage
FROM nginx:1.29-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
