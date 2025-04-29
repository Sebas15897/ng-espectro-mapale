#!/bin/bash

# Construir la aplicación
ng build --configuration production

# Crear el archivo .nojekyll
touch docs/.nojekyll

# Agregar todos los archivos al staging
git add .

# Commit con un mensaje descriptivo
git commit -m "Deploy to GitHub Pages"

# Empujar los cambios a GitHub
git push origin main
