#Use multistage build for a react application

# Stage 1: Build the React application
FROM node:24-alpine as base
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Copy static files
COPY --from=base /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for routing and proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

