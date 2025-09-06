param(
    [switch]$Force
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "=                                     =" -ForegroundColor Cyan
Write-Host "= Setting up TensorFlow 2.19.0 Environment =" -ForegroundColor Cyan
Write-Host "=                                     =" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if conda is available
try {
    $condaVersion = conda --version 2>$null
    Write-Host "Conda found: $condaVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Conda is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Miniconda or Anaconda first" -ForegroundColor Yellow
    Write-Host "Download from: https://docs.conda.io/en/latest/miniconda.html" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if tf219 environment already exists
$envExists = conda env list | Select-String "tf219"
if ($envExists -and !$Force) {
    Write-Host "TensorFlow 2.19.0 environment 'tf219' already exists!" -ForegroundColor Green
    Write-Host "Activating existing environment..."

    try {
        conda activate tf219
        Write-Host "Environment activated successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to activate environment. It may be corrupted." -ForegroundColor Red
        Write-Host "Please delete it manually: conda env remove -n tf219" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    if ($Force -and $envExists) {
        Write-Host "Force reinstall requested. Removing existing environment..." -ForegroundColor Yellow
        conda env remove -n tf219 -y
    }

    Write-Host "Creating new TensorFlow 2.19.0 environment..." -ForegroundColor Yellow
    Write-Host "This may take several minutes..." -ForegroundColor Yellow

    # Create the environment with Python 3.10
    try {
        conda create -n tf219 python=3.10 -y
    } catch {
        Write-Host "ERROR: Failed to create conda environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }

    # Activate the environment
    try {
        conda activate tf219
    } catch {
        Write-Host "ERROR: Failed to activate conda environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }

    Write-Host "Installing TensorFlow 2.19.0 and dependencies..." -ForegroundColor Yellow
    Write-Host "This will take some time, please wait..." -ForegroundColor Yellow

    # Install TensorFlow and other packages
    try {
        conda install tensorflow=2.19.0 -c conda-forge -y
    } catch {
        Write-Host "WARNING: Conda installation failed, trying pip..." -ForegroundColor Yellow
        try {
            pip install tensorflow==2.19.0
        } catch {
            Write-Host "ERROR: Failed to install TensorFlow" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }

    # Install additional packages
    try {
        pip install opencv-python numpy h5py
    } catch {
        Write-Host "WARNING: Some packages may not have installed correctly" -ForegroundColor Yellow
    }

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "=                                     =" -ForegroundColor Green
    Write-Host "= Environment setup complete!        =" -ForegroundColor Green
    Write-Host "=                                     =" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
}

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Yellow

# Test TensorFlow import
try {
    $tfVersion = python -c "import tensorflow as tf; print(tf.__version__)" 2>$null
    Write-Host "TensorFlow verified successfully! Version: $tfVersion" -ForegroundColor Green
} catch {
    Write-Host "WARNING: TensorFlow import failed" -ForegroundColor Yellow
    Write-Host "The environment may not be working correctly" -ForegroundColor Yellow
}

# Test other packages
try {
    python -c "import cv2, numpy, h5py; print('All packages imported successfully!')" 2>$null | Out-Null
    Write-Host "All required packages verified!" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Some packages may not be working correctly" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "=                                     =" -ForegroundColor Cyan
Write-Host "= Environment is ready to use!       =" -ForegroundColor Cyan
Write-Host "=                                     =" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To use this environment in the future:" -ForegroundColor White
Write-Host "  1. Open PowerShell" -ForegroundColor White
Write-Host "  2. Run: conda activate tf219" -ForegroundColor White
Write-Host "  3. Or run this script again: .\setup_tf219_env.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Your TensorFlow 2.19.0 environment will persist between sessions!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
