#!/bin/sh

# Get the UID and GID of the user running the container
# If the user is not root, use their UID/GID. Otherwise, use the 'nginx' user's UID/GID.
# This handles cases where the container is run as root (default) or a specific user.
if [ "$(id -u)" = "0" ]; then
    # Running as root, use the nginx user's ID for permissions
    NGINX_UID=$(id -u nginx)
    NGINX_GID=$(id -g nginx)
else
    # Running as a non-root user, use their UID/GID
    NGINX_UID=$(id -u)
    NGINX_GID=$(id -g)
fi

# Ensure Nginx cache and run directories are writable by the current user
# or the nginx user if running as root.
chown -R ${NGINX_UID}:${NGINX_GID} /var/cache/nginx /var/run

# Execute the original Nginx command
exec nginx -g "daemon off;"
