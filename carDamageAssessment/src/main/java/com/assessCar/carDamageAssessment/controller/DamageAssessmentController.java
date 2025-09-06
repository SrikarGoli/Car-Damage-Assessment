package com.assessCar.carDamageAssessment.controller;

import java.io.File;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.assessCar.carDamageAssessment.entity.DamageAssessment;
import com.assessCar.carDamageAssessment.service.DamageAssessmentService;

@RestController
@RequestMapping("/api")
public class DamageAssessmentController {
    @GetMapping("/assess/{id}")
    public ResponseEntity<?> getAssessmentById(@PathVariable Long id) {
        System.out.println("[DEBUG] getAssessmentById called with id: " + id);
        return service.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No assessment found for id: " + id));
    }

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @Autowired
    private DamageAssessmentService service;

    @PostMapping("/assess")
    public ResponseEntity<?> assessDamage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        try {
            System.out.println("[DEBUG] assessDamage called");
            // Ensure upload directory exists
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdir();

            // Save uploaded file locally
            String originalFilename = file.getOriginalFilename();
            System.out.println("[DEBUG] originalFilename: " + originalFilename);
            if (originalFilename == null) {
                System.out.println("[ERROR] File name is missing");
                return ResponseEntity.badRequest().body("File name is missing");
            }
            String filename = StringUtils.cleanPath(originalFilename);
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.write(filePath, file.getBytes());
            System.out.println("[DEBUG] file saved to: " + filePath);

            // Call your TensorFlow model here for prediction (integers 0,1,2)
            System.out.println("[DEBUG] Calling runTensorFlowModel with: " + filePath);
            int prediction = runTensorFlowModel(filePath.toString());
            System.out.println("[DEBUG] Prediction result: " + prediction);

            // Map prediction to label
            String damageLevel = mapPredictionToLabel(prediction);
            System.out.println("[DEBUG] Damage level: " + damageLevel);


            // Always create a new DamageAssessment record for each upload
            DamageAssessment assessment = new DamageAssessment();
            assessment.setImagePath(filePath.toString());
            assessment.setDamageLevel(damageLevel);

            DamageAssessment savedAssessment = service.save(assessment);
            System.out.println("[DEBUG] Assessment saved");

            // Return only the ID, imagePath, and damageLevel for frontend
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", savedAssessment.getId());
            response.put("imagePath", savedAssessment.getImagePath());
            response.put("damageLevel", savedAssessment.getDamageLevel());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("[ERROR] Exception in assessDamage: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving file or processing: " + e.getMessage());
        }
    }

    @GetMapping("/assess")
    public ResponseEntity<Object> getAssessment() {
        return service.findById(1L)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No assessment found"));
    }

    private int runTensorFlowModel(String imagePath) {
        try {
            // Use the custom loader that handles layer configuration issues
            ProcessBuilder pb = new ProcessBuilder(
                "C:\\Users\\srika\\.conda\\envs\\tf219\\python.exe",
                "C:\\Users\\srika\\SpringBoot\\carDamageAssessment\\src\\main\\resources\\model\\custom_loader.py",
                "C:\\Users\\srika\\SpringBoot\\carDamageAssessment\\src\\main\\resources\\model\\incep_200.h5",
                imagePath
            );
            pb.directory(new java.io.File("C:\\Users\\srika\\SpringBoot\\carDamageAssessment"));

            // Only capturing stdout for results, stderr will go to console
            pb.redirectErrorStream(false);
            Process process = pb.start();

            try (java.io.BufferedReader reader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(process.getInputStream()));
                 java.io.BufferedReader errorReader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(process.getErrorStream()))) {

                // Read error stream in a separate thread to prevent deadlock
                Thread errorThread = new Thread(() -> {
                    try {
                        String line;
                        while ((line = errorReader.readLine()) != null) {
                            System.err.println("Python stderr: " + line);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });
                errorThread.start();

                // Read the output (should be just the index number)
                int exitCode = process.waitFor();
                String line = null;
                String lastLine = null;
                while ((line = reader.readLine()) != null) {
                    lastLine = line;
                }
                line = lastLine; // Use the last line which should contain the result
                errorThread.join(); // Wait for error printing to complete

                // Accept output even with exit code 1, as our fallback method still produces valid output
                if (line != null && !line.isEmpty()) {
                    System.out.println("[DEBUG] Python output: '" + line + "' (exit code: " + exitCode + ")");
                    try {
                        return Integer.parseInt(line.trim());
                    } catch (NumberFormatException e) {
                        System.err.println("[ERROR] Could not parse prediction output: '" + line + "'");
                        return -1;
                    }
                } else {
                    System.err.println("[ERROR] Python script produced no output, exit code: " + exitCode);
                    return -1;
                }
            }
        } catch (Exception e) {
            System.err.println("[ERROR] Exception running Python script: " + e.getMessage());
            e.printStackTrace();
            return -1; 
        }
    }


    private String mapPredictionToLabel(int prediction) {
        return switch (prediction) {
            case 0 -> "minor";
            case 1 -> "moderate";
            case 2 -> "severe";
            case -1 -> "model_error";  // Special code for model errors
            default -> "unknown";
        };
    }
}
