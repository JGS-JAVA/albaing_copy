package com.jobjob.albaing.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

@PostConstruct
public void initialize() {
try {
ClassPathResource resource = new ClassPathResource("firebase-config.json");

FirebaseOptions options = FirebaseOptions.builder()
.setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
.setStorageBucket("albaing-45513.firebasestorage.app")
.build();

if (FirebaseApp.getApps().isEmpty()) {
FirebaseApp.initializeApp(options);
}
} catch (IOException e) {
throw new RuntimeException("Firebase 초기화 실패", e);
}
}

@PostConstruct
public void checkFirebase() {
    try {
        System.out.println("Firebase 버킷: " + StorageClient.getInstance().bucket().getName());
    } catch (Exception e) {
        System.err.println("Firebase 초기화 실패: " + e.getMessage());
        e.printStackTrace();
    }
}
}