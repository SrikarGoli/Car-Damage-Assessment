#!/usr/bin/env python3
"""
TensorFlow Environment Verification Script
Tests that all required packages are installed and working correctly.
"""

import sys
import os

def test_import(package_name, import_name=None):
    """Test if a package can be imported"""
    if import_name is None:
        import_name = package_name

    try:
        __import__(import_name)
        print(f"✅ {package_name} - OK")
        return True
    except ImportError as e:
        print(f"❌ {package_name} - FAILED: {e}")
        return False

def test_tensorflow():
    """Test TensorFlow installation and version"""
    try:
        import tensorflow as tf
        version = tf.__version__
        print(f"✅ TensorFlow {version} - OK")

        # Test basic functionality
        hello = tf.constant("Hello, TensorFlow!")
        print(f"   Basic test passed: {hello.numpy().decode('utf-8')}")

        return True
    except Exception as e:
        print(f"❌ TensorFlow - FAILED: {e}")
        return False

def test_opencv():
    """Test OpenCV installation"""
    try:
        import cv2
        version = cv2.__version__
        print(f"✅ OpenCV {version} - OK")
        return True
    except Exception as e:
        print(f"❌ OpenCV - FAILED: {e}")
        return False

def main():
    print("🔍 TensorFlow Environment Verification")
    print("=" * 40)

    # Test Python version
    python_version = sys.version.split()[0]
    print(f"🐍 Python version: {python_version}")

    # Test basic packages
    packages_ok = []
    packages_ok.append(test_import("numpy"))
    packages_ok.append(test_import("h5py"))

    # Test TensorFlow
    packages_ok.append(test_tensorflow())

    # Test OpenCV
    packages_ok.append(test_opencv())

    print("\n" + "=" * 40)

    if all(packages_ok):
        print("🎉 All tests passed! Your environment is ready.")
        print("\nYou can now run:")
        print("  conda activate tf219")
        print("  ./mvnw spring-boot:run")
        return 0
    else:
        print("⚠️  Some tests failed. Please run the setup script again:")
        print("  ./setup_tf219_env.bat")
        print("  # or")
        print("  ./setup_tf219_env.ps1")
        return 1

if __name__ == "__main__":
    sys.exit(main())
