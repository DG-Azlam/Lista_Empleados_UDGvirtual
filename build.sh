#!/bin/bash
echo "Instalando extensiones de PHP para PostgreSQL..."
apt-get update
apt-get install -y libpq-dev php-pgsql
docker-php-ext-install pdo pdo_pgsql
echo "Instalación completada!"