# 🚗 Car Damage Assessment System - Complete Setup Guide

## 📋 Prerequisites

### System Requirements
- **OS**: Windows 10/11
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 5GB free space
- **Internet**: Required for initial setup

### Software Requirements
- **Java 17+** (JDK)
- **Maven 3.6+**
- **Miniconda or Anaconda**

---

## 🔧 Step-by-Step Setup

### Step 1: Install Prerequisites

#### Install Java (JDK 17+)
```cmd
# Download from: https://adoptium.net/temurin/releases/
# Or use Chocolatey:
choco install temurin17
```

#### Install Maven
```cmd
# Download from: https://maven.apache.org/download.cgi
# Or use Chocolatey:
choco install maven
```

#### Install Miniconda
```cmd
# Download from: https://docs.conda.io/en/latest/miniconda.html
# Run the installer
```

### Step 2: Get the Project

#### Option A: Download ZIP
1. Download the project as ZIP from your repository
2. Extract to a folder (e.g., `C:\Projects\carDamageAssessment`)

#### Option B: Clone Repository
```cmd
git clone <your-repository-url>
cd carDamageAssessment
```

### Step 3: Set Up TensorFlow Environment

#### Run the Setup Script
```cmd
# Navigate to project directory
cd C:\Projects\carDamageAssessment

# Run setup (choose one):
.\setup_tf219_env.bat
# OR
.\setup_tf219_env.ps1
```

**What happens:**
- ✅ Checks for existing TensorFlow environment
- ✅ Creates `tf219` conda environment (if needed)
- ✅ Downloads TensorFlow 2.19.0 (~375MB)
- ✅ Installs OpenCV, NumPy, H5Py
- ✅ Verifies all installations

**Time:** 10-15 minutes for first setup, 5 seconds for subsequent runs

### Step 4: Verify Environment

```cmd
# Activate environment
conda activate tf219

# Run verification
python verify_tf_environment.py
```

**Expected output:**
```
🔍 TensorFlow Environment Verification
========================================
🐍 Python version: 3.10.18
✅ numpy - OK
✅ h5py - OK
✅ TensorFlow 2.19.0 - OK
✅ OpenCV 4.12.0 - OK
========================================
🎉 All tests passed! Your environment is ready.
```

### Step 5: Build the Application

```cmd
# Compile the project
.\mvnw compile

# Expected: BUILD SUCCESS
```

### Step 6: Run the Application

```cmd
# Start Spring Boot application
.\mvnw spring-boot:run
```

**Expected output:**
```
Tomcat started on port 8080 (http) with context path '/'
Started CarDamageAssessmentApplication in X.XXX seconds
```

### Step 7: Access the Application

#### Open Browser
Navigate to: **http://localhost:8080**

#### Upload Test Image
1. Click "Choose Image of Damaged Car"
2. Select a car damage image (JPG/PNG)
3. Click "Assess Damage"
4. View results with damage level and confidence

---

## 🧪 Testing the System

### Test with Sample Image
```cmd
# Place test image in uploads folder
copy test_damage.jpg uploads/

# Test via API
curl -X POST -F "file=@uploads/test_damage.jpg" http://localhost:8080/api/assess
```

### Expected API Response
```json
{
  "id": 1,
  "imagePath": "C:\\Projects\\carDamageAssessment\\uploads\\test_damage.jpg",
  "damageLevel": "moderate"
}
```

---

## 📁 Project Structure

```
carDamageAssessment/
├── src/main/
│   ├── java/...                    # Spring Boot controllers, entities, services
│   └── resources/
│       ├── static/                 # Frontend (HTML, CSS, JS)
│       └── model/                  # ML model and Python scripts
│           ├── incep_200.h5       # Trained TensorFlow model
│           └── custom_loader.py   # Model loading script
├── uploads/                       # User uploaded images
├── setup_tf219_env.bat           # Environment setup (Batch)
├── setup_tf219_env.ps1           # Environment setup (PowerShell)
├── verify_tf_environment.py      # Environment verification
├── TENSORFLOW_SETUP_README.md    # Setup documentation
└── pom.xml                       # Maven configuration
```

---

## 🔧 Troubleshooting

### Issue: "conda command not found"
```cmd
# Add conda to PATH or use full path
C:\Users\<username>\miniconda3\Scripts\conda.exe activate tf219
```

### Issue: Port 8080 already in use
```cmd
# Kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or run on different port
.\mvnw spring-boot:run -Dserver.port=8081
```

### Issue: TensorFlow download fails
```cmd
# Try force reinstall
.\setup_tf219_env.ps1 -Force

# Or manual install
conda activate tf219
pip install tensorflow==2.19.0
```

### Issue: Model prediction fails
```cmd
# Test model directly
python src/main/resources/model/custom_loader.py ^
  src/main/resources/model/incep_200.h5 ^
  uploads/test_image.jpg
```

---

## 🚀 Quick Start Commands

```cmd
# One-time setup
git clone <repo-url>
cd carDamageAssessment
.\setup_tf219_env.bat
conda activate tf219
python verify_tf_environment.py

# Daily usage
conda activate tf219
.\mvnw spring-boot:run

# Access: http://localhost:8080
```

---

## 📞 Support

If you encounter issues:
1. Check the `TENSORFLOW_SETUP_README.md` for detailed troubleshooting
2. Run `python verify_tf_environment.py` to diagnose environment issues
3. Check Spring Boot logs for application errors
4. Ensure all prerequisites are installed correctly

---

## 🎯 System Features

- ✅ **Deep Learning Model**: TensorFlow 2.19.0 with InceptionV3
- ✅ **Web Interface**: Modern HTML5 frontend
- ✅ **REST API**: JSON-based assessment endpoint
- ✅ **Database**: H2 in-memory database for assessments
- ✅ **File Upload**: Secure image handling
- ✅ **Real-time Processing**: Instant damage classification
- ✅ **Error Handling**: Graceful failure recovery

**Damage Classes:**
- **0**: Minor damage
- **1**: Moderate damage
- **2**: Severe damage

---

## 📈 Performance

- **Model Load Time**: ~3-5 seconds
- **Prediction Time**: ~2-3 seconds per image
- **Memory Usage**: ~2GB RAM during operation
- **Storage**: ~500MB for model + environment

---

**🎉 You're all set! Your car damage assessment system is ready to use!**
