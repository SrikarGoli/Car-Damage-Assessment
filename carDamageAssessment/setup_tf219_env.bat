@echo off
echo ========================================
echo =                                     =
echo = Setting up TensorFlow 2.19.0 Environment =
echo =                                     =
echo ========================================

REM Check if conda is available
where conda >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Conda is not installed or not in PATH
    echo Please install Miniconda or Anaconda first
    echo You can download it from: https://docs.conda.io/en/latest/miniconda.html
    pause
    exit /b 1
)

REM Check if tf219 environment already exists
conda env list | findstr "tf219" >nul 2>nul
if %errorlevel% equ 0 (
    echo TensorFlow 2.19.0 environment 'tf219' already exists!
    echo Activating existing environment...
    call conda activate tf219
    if %errorlevel% equ 0 (
        echo Environment activated successfully!
        goto :verify_installation
    ) else (
        echo Failed to activate environment. It may be corrupted.
        echo Please delete it manually: conda env remove -n tf219
        pause
        exit /b 1
    )
)

echo Creating new TensorFlow 2.19.0 environment...
echo This may take several minutes...

REM Create the environment with Python 3.10
call conda create -n tf219 python=3.10 -y
if %errorlevel% neq 0 (
    echo ERROR: Failed to create conda environment
    echo Please check your conda installation
    pause
    exit /b 1
)

REM Activate the environment
call conda activate tf219
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate conda environment
    pause
    exit /b 1
)

echo Installing TensorFlow 2.19.0 and dependencies...
echo This will take some time, please wait...

REM Install TensorFlow and other packages
call conda install tensorflow=2.19.0 -c conda-forge -y
if %errorlevel% neq 0 (
    echo WARNING: Conda installation failed, trying pip...
    pip install tensorflow==2.19.0
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install TensorFlow
        pause
        exit /b 1
    )
)

REM Install additional packages
pip install opencv-python numpy h5py
if %errorlevel% neq 0 (
    echo WARNING: Some packages may not have installed correctly
)

echo ========================================
echo =                                     =
echo = Environment setup complete!        =
echo =                                     =
echo ========================================

:verify_installation
echo Verifying installation...

REM Test TensorFlow import
python -c "import tensorflow as tf; print(f'TensorFlow version: {tf.__version__}')" 2>nul
if %errorlevel% neq 0 (
    echo WARNING: TensorFlow import failed
    echo The environment may not be working correctly
) else (
    echo TensorFlow verified successfully!
)

REM Test other packages
python -c "import cv2, numpy, h5py; print('All packages imported successfully!')" 2>nul
if %errorlevel% neq 0 (
    echo WARNING: Some packages may not be working correctly
) else (
    echo All required packages verified!
)

echo.
echo ========================================
echo =                                     =
echo = Environment is ready to use!       =
echo =                                     =
echo ========================================
echo.
echo To use this environment in the future:
echo   1. Open Command Prompt or PowerShell
echo   2. Run: conda activate tf219
echo   3. Or run this batch file again to verify/activate
echo.
echo Your TensorFlow 2.19.0 environment will persist between sessions!
echo.
pause
