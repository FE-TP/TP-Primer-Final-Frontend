#!/bin/bash

echo "🚀 Iniciando Sistema de Reservas de Mesas..."
echo ""

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo ""
fi

echo "✨ Iniciando servidor de desarrollo..."
echo "📍 La aplicación estará disponible en: http://localhost:4200"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

npm start
