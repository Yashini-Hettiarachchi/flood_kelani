@echo off
echo ========================================
echo Kelani Ganga Flood Prediction System
echo ========================================
echo.
echo Starting all services...
echo.

REM Start PostgreSQL (if not running)
echo [1/4] Checking PostgreSQL...
pg_ctl status >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL is not running. Please start PostgreSQL service first.
    pause
    exit /b 1
)
echo ✓ PostgreSQL is running
echo.

REM Start FastAPI ML Service
echo [2/4] Starting FastAPI ML Service (Port 8000)...
start "FastAPI ML Service" cmd /k "cd ENV_RISK_BACKEND && python ml_service.py"
timeout /t 3 /nobreak >nul
echo ✓ FastAPI ML Service started
echo.

REM Start Express Backend
echo [3/4] Starting Express Backend (Port 5000)...
start "Express Backend" cmd /k "cd ENV_RISK_BACKEND && npm start"
timeout /t 3 /nobreak >nul
echo ✓ Express Backend started
echo.

REM Start Next.js Frontend
echo [4/4] Starting Next.js Frontend (Port 3000)...
start "Next.js Frontend" cmd /k "cd ENV_RISK_FRONTEND && npm run dev"
timeout /t 3 /nobreak >nul
echo ✓ Next.js Frontend started
echo.

echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Services:
echo - FastAPI ML: http://localhost:8000
echo - Express API: http://localhost:5000
echo - Frontend:    http://localhost:3000
echo.
echo Press any key to open the application...
pause >nul
start http://localhost:3000
