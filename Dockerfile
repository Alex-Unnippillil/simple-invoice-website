# Stage 1: install dependencies
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: build (run tests, compile if needed)
FROM deps AS build
COPY . .
RUN npm test

# Stage 3: runtime
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
