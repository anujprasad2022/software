# Use nginx for serving static files
FROM nginx:alpine

# Copy static files to nginx
COPY . /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80
