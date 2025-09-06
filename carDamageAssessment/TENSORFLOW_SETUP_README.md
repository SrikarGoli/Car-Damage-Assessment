# TensorFlow 2.19.0 Environment Setup

This project requires a specific TensorFlow 2.19.0 environment for the car damage assessment model to work correctly.

## Quick Setup

### Option 1: Batch File (Windows)
```cmd
.\setup_tf219_env.bat
```

### Option 2: PowerShell Script (Windows)
```powershell
.\setup_tf219_env.ps1
```

### Option 3: Force Reinstall (PowerShell)
```powershell
.\setup_tf219_env.ps1 -Force
```

## Verify Environment

After setup, verify everything is working:

```cmd
C:\Users\srika\.conda\envs\tf219\python.exe verify_tf_environment.py
```

Or activate the environment first:
```cmd
conda activate tf219
python verify_tf_environment.py
```

## What the Setup Does

1. **Checks for Conda**: Verifies that Miniconda/Anaconda is installed
2. **Environment Check**: Looks for existing `tf219` environment
3. **Creates Environment**: If not found, creates new conda environment with Python 3.10
4. **Installs Packages**:
   - TensorFlow 2.19.0
   - OpenCV-Python
   - NumPy
   - H5Py
5. **Verification**: Tests that all packages are working correctly

## Usage After Setup

### Activate Environment
```cmd
conda activate tf219
```

### Run the Application
```cmd
.\mvnw spring-boot:run
```

### Test the Model
```cmd
python src/main/resources/model/custom_loader.py src/main/resources/model/incep_200.h5 uploads/your_image.jpg
```

## Troubleshooting

### Environment Already Exists
If you need to recreate the environment:
```powershell
.\setup_tf219_env.ps1 -Force
```

### Manual Environment Removal
```cmd
conda env remove -n tf219
```

### Conda Not Found
1. Install Miniconda: https://docs.conda.io/en/latest/miniconda.html
2. Restart your terminal/command prompt
3. Run the setup script again

## Environment Persistence

The `tf219` conda environment will persist between Windows sessions. You only need to:
1. Run `conda activate tf219` to use it
2. Or run the setup script again to verify/reactivate it

## Files Created

- `setup_tf219_env.bat` - Windows batch file for setup
- `setup_tf219_env.ps1` - PowerShell script for setup
- `verify_tf_environment.py` - Verification script
- `TENSORFLOW_SETUP_README.md` - This documentation

## System Requirements

- Windows 10/11
- Miniconda or Anaconda installed
- At least 4GB free RAM
- At least 2GB free disk space for TensorFlow installation
