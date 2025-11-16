#!/bin/bash
echo "================================================"
echo "  INSTALANDO PHP Y EXTENSIONES PARA RENDER"
echo "================================================"

# Actualizar lista de paquetes
echo "1. Actualizando lista de paquetes..."
apt-get update -y

# Instalar PHP y extensiones necesarias
echo "2. Instalando PHP y extensiones PostgreSQL..."
apt-get install -y \
    php \
    php-common \
    php-pgsql \
    php-pdo \
    php-mbstring

# Verificar instalación
echo "3. Verificando instalación..."
echo "--- Versión de PHP ---"
php --version
echo "--- Extensiones PHP ---"
php -m | grep pgsql
echo "--- Extensiones PHP ---"
php -m | grep pdo

# Dar permisos de ejecución si hay otros scripts
chmod +x *.sh 2>/dev/null || true

echo "================================================"
echo "  INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "================================================"
echo "PHP y PostgreSQL están listos para usar"
echo "Iniciando servidor PHP..."