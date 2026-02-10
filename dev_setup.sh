#!/bin/bash
# Setup script for Admin Panel dependencies

echo "Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Installing Frontend Dependencies..."
cd frontend
npm install react-router-dom axios
cd ..

echo "Setup Complete! Restart your servers."
echo "Backend: cd backend && uvicorn main:app --reload"
echo "Frontend: cd frontend && npm run dev"
echo "Admin Login: http://localhost:5173/admin"
echo "Default Credentials: admin / admin123"
