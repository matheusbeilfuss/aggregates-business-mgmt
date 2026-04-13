#!/bin/sh
mkdir -p /app/uploads
chown -R appuser:appuser /app/uploads
exec su -s /bin/sh appuser -c '/opt/java/openjdk/bin/java -jar /app/app.jar'
