class CarDamageAssessment {
  constructor() {
    this.form = document.getElementById('damageForm');
    this.fileInput = document.getElementById('fileInput');
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInfo = document.getElementById('fileInfo');
    this.filePreview = document.getElementById('filePreview');
    this.fileName = document.getElementById('fileName');
    this.fileSize = document.getElementById('fileSize');
    this.analyzeBtn = document.getElementById('analyzeBtn');

    this.loadingSection = document.getElementById('loadingSection');
    this.progressFill = document.getElementById('progressFill');
    this.steps = [
      document.getElementById('step1'),
      document.getElementById('step2'),
      document.getElementById('step3')
    ];

    this.resultsSection = document.getElementById('resultsSection');
    this.resultImage = document.getElementById('resultImage');
    this.damageLevelText = document.getElementById('damageLevelText');
    this.damageBadge = document.getElementById('damageBadge');
    this.damageIcon = document.getElementById('damageIcon');
    this.damageTitle = document.getElementById('damageTitle');
    this.damageDescription = document.getElementById('damageDescription');
    this.confidencePercent = document.getElementById('confidencePercent');
    this.confidenceFill = document.getElementById('confidenceFill');
    this.recommendationList = document.getElementById('recommendationList');

    this.errorSection = document.getElementById('errorSection');
    this.errorMessage = document.getElementById('errorMessage');

    this.currentFile = null;
    this.isAnalyzing = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupDragAndDrop();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
  }

  setupDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      this.uploadArea.addEventListener(eventName, () => {
        this.uploadArea.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.uploadArea.addEventListener(eventName, () => {
        this.uploadArea.classList.remove('dragover');
      });
    });

    this.uploadArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFile(files[0]);
      }
    });
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file) {
    if (!this.validateFile(file)) return;

    this.currentFile = file;
    this.displayFileInfo(file);
    this.fileInfo.style.display = 'block';
  }

  validateFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      this.showError('Please select a valid image file (JPEG, PNG).');
      return false;
    }

    if (file.size > maxSize) {
      this.showError('File size must be less than 10MB.');
      return false;
    }

    return true;
  }

  displayFileInfo(file) {
    this.fileName.textContent = file.name;
    this.fileSize.textContent = this.formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.currentFile) {
      this.showError('Please select an image file first.');
      return;
    }

    if (this.isAnalyzing) return;

    this.isAnalyzing = true;
    this.showLoading();

    try {
      const formData = new FormData();
      formData.append('file', this.currentFile);

      const response = await fetch('/api/assess', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Server error');
      }

      const data = await response.json();
      this.showResults(data);
    } catch (error) {
      this.showError('Error: ' + error.message);
    } finally {
      this.isAnalyzing = false;
    }
  }

  showLoading() {
    this.hideAllSections();
    this.loadingSection.style.display = 'block';
    this.loadingSection.classList.add('fade-in');

    // Animate progress and steps
    this.animateProgress();
  }

  animateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      this.progressFill.style.width = progress + '%';

      // Update steps based on progress
      if (progress >= 30) this.updateStep(1);
      if (progress >= 70) this.updateStep(2);
      if (progress >= 100) this.updateStep(3);
    }, 200);
  }

  updateStep(stepIndex) {
    this.steps.forEach((step, index) => {
      if (index <= stepIndex) {
        step.classList.add('active');
      }
    });
  }

  showResults(data) {
    this.hideAllSections();
    this.resultsSection.style.display = 'block';
    this.resultsSection.classList.add('fade-in');

    // Set result image
    const imageUrl = data.imagePath
      ? data.imagePath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/')
      : '';
    this.resultImage.src = imageUrl;

    // Set damage level
    this.setDamageLevel(data.damageLevel);

    // Set confidence
    const confidence = data.confidence || 0;
    this.confidencePercent.textContent = Math.round(confidence * 100) + '%';
    this.confidenceFill.style.width = (confidence * 100) + '%';

    // Generate recommendations
    this.generateRecommendations(data.damageLevel);
  }

  setDamageLevel(level) {
    const damageConfig = {
      minor: {
        text: 'Minor Damage',
        color: '#45B7D1',
        icon: 'fas fa-tools',
        title: 'Minor Damage Detected',
        description: 'The vehicle shows signs of minor cosmetic damage that can typically be repaired with basic bodywork and paint touch-up.'
      },
      moderate: {
        text: 'Moderate Damage',
        color: '#FFA07A',
        icon: 'fas fa-wrench',
        title: 'Moderate Damage Detected',
        description: 'The vehicle has moderate structural damage that may require panel replacement and professional repair services.'
      },
      severe: {
        text: 'Severe Damage',
        color: '#FF6B6B',
        icon: 'fas fa-exclamation-triangle',
        title: 'Severe Damage Detected',
        description: 'The vehicle has significant structural damage that will require extensive repairs and should be inspected by a professional mechanic.'
      },
      model_error: {
        text: 'Edge Analysis',
        color: '#9F7AEA',
        icon: 'fas fa-brain',
        title: 'Edge-Based Assessment',
        description: 'AI model unavailable. Analysis performed using edge detection methods. Results may be less accurate.'
      },
      unknown: {
        text: 'Unknown',
        color: '#A0AEC0',
        icon: 'fas fa-question',
        title: 'Unable to Determine',
        description: 'Could not determine the damage level from the provided image. Please try with a clearer image of the damaged area.'
      }
    };

    const config = damageConfig[level] || damageConfig.unknown;

    this.damageLevelText.textContent = config.text;
    this.damageBadge.style.backgroundColor = config.color;
    this.damageIcon.className = config.icon;
    this.damageTitle.textContent = config.title;
    this.damageDescription.textContent = config.description;
  }

  generateRecommendations(level) {
    const recommendations = {
      minor: [
        'Schedule a professional inspection to assess repair costs',
        'Consider cosmetic touch-up services',
        'Document the damage with photos for insurance',
        'Check for any underlying issues beneath the surface damage'
      ],
      moderate: [
        'Contact your insurance provider immediately',
        'Get multiple repair quotes from certified body shops',
        'Consider rental reimbursement if vehicle is undrivable',
        'Document all communications with repair facilities'
      ],
      severe: [
        'Do not drive the vehicle until inspected by a professional',
        'Contact your insurance provider for total loss assessment',
        'Consider salvage value if repairs exceed vehicle worth',
        'Consult with multiple repair specialists for comprehensive estimates'
      ],
      model_error: [
        'Results are based on basic image analysis',
        'Consider professional inspection for accurate assessment',
        'AI model may be temporarily unavailable',
        'Try uploading a different image with better lighting'
      ],
      unknown: [
        'Try uploading a clearer image of the damage',
        'Ensure the damaged area is well-lit and in focus',
        'Include multiple angles if possible',
        'Consider professional assessment if unsure'
      ]
    };

    const recs = recommendations[level] || recommendations.unknown;

    this.recommendationList.innerHTML = recs.map(rec => `
      <div class="recommendation-item">
        <i class="fas fa-check-circle"></i>
        <span>${rec}</span>
      </div>
    `).join('');
  }

  showError(message) {
    this.hideAllSections();
    this.errorSection.style.display = 'block';
    this.errorSection.classList.add('fade-in');
    this.errorMessage.textContent = message;
  }

  hideAllSections() {
    [this.loadingSection, this.resultsSection, this.errorSection].forEach(section => {
      section.style.display = 'none';
      section.classList.remove('fade-in');
    });

    // Reset loading state
    this.progressFill.style.width = '0%';
    this.steps.forEach(step => step.classList.remove('active'));
  }

  resetForm() {
    this.currentFile = null;
    this.fileInput.value = '';
    this.fileInfo.style.display = 'none';
    this.hideAllSections();
    this.isAnalyzing = false;
    this.analyzeBtn.disabled = false;
  }

  downloadReport() {
    // Simple report download functionality
    const reportData = {
      timestamp: new Date().toISOString(),
      damageLevel: this.damageLevelText.textContent,
      confidence: this.confidencePercent.textContent,
      recommendations: Array.from(this.recommendationList.children).map(item =>
        item.textContent.trim()
      )
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `damage-assessment-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Clear file functionality
function clearFile() {
  const app = window.carDamageApp;
  if (app) {
    app.resetForm();
  }
}

// Reset form functionality
function resetForm() {
  const app = window.carDamageApp;
  if (app) {
    app.resetForm();
  }
}

// Download report functionality
function downloadReport() {
  const app = window.carDamageApp;
  if (app) {
    app.downloadReport();
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.carDamageApp = new CarDamageAssessment();
});
