package com.jobjob.albaing.service;

import com.google.cloud.storage.*;
import com.google.firebase.cloud.StorageClient;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

@Service
@Primary
public class FirebaseFileServiceImpl implements FileService {

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("파일이 비어 있습니다.");
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = "uploads/" + UUID.randomUUID() + extension;

            Storage storage = StorageClient.getInstance().bucket().getStorage();

            BlobId blobId = BlobId.of(StorageClient.getInstance().bucket().getName(), fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .setCacheControl("public, max-age=31536000")
                .setAcl(Arrays.asList(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER)))
                .build();

            Blob blob = storage.create(blobInfo, file.getBytes());

            return String.format("https://storage.googleapis.com/%s/%s",
                StorageClient.getInstance().bucket().getName(), fileName);
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 중 오류 발생: " + e.getMessage(), e);
        }
    }
}