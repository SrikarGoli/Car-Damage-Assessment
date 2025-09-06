@echo off
echo ========================================
echo =                                     =
echo = Car Damage Assessment - Quick Start =
echo =                                     =
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "pom.xml" (
    echo ERROR: Please run this script from the project root directory
    echo (where pom.xml is located)
    pause
    exit /b 1
)

echo Step 1: Setting up TensorFlow environment...
echo.

REM Run TensorFlow setup
call .\setup_tf219_env.bat
if %errorlevel% neq 0 (
    echo ERROR: TensorFlow setup failed
    pause
    exit /b 1
)

echo.
echo Step 2: Activating TensorFlow environment...
echo.

REM Activate environment
call conda activate tf219
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate TensorFlow environment
    pause
    exit /b 1
)

echo.
echo Step 3: Verifying environment...
echo.

REM Run verification
python verify_tf_environment.py
if %errorlevel% neq 0 (
    echo ERROR: Environment verification failed
    pause
    exit /b 1
)

echo.
echo Step 4: Building application...
echo.

REM Build the application
call .\mvnw compile
if %errorlevel% neq 0 (
    echo ERROR: Application build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo =                                     =
echo = Setup Complete! Ready to run!      =
echo =                                     =
echo ========================================
echo.
echo To start the application:
echo   1. Keep this terminal open (environment is active)
echo   2. Open a NEW terminal
echo   3. Run: conda activate tf219
echo   4. Run: .\mvnw spring-boot:run
echo   5. Open: http://localhost:8080
echo.
echo Or run the application now? (Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    echo.
    echo Starting Spring Boot application...
    echo (Press Ctrl+C to stop)
    echo.
    call .\mvnw spring-boot:run
) else (
    echo.
    echo To run later:
    echo   conda activate tf219
    echo   .\mvnw spring-boot:run
    echo.
)

pause
