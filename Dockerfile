# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
# If no build step exists, this no-ops
RUN npm run build || echo "no build step"

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
# Keep only prod deps if package.json exists
RUN if [ -f package.json ]; then npm ci --omit=dev; fi
EXPOSE 3000
CMD ["npm", "start"]
