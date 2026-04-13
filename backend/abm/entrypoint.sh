#!/bin/sh
set -e
mkdir -p /app/uploads
if [ "$(stat -c '%U:%G' /app/uploads)" != "appuser:appuser" ]; then
  chown appuser:appuser /app/uploads
fi
exec su -s /bin/sh appuser -c '/opt/java/openjdk/bin/java -jar /app/app.jar'
