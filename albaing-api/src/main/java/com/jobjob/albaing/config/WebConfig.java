package com.jobjob.albaing.config;

import com.jobjob.albaing.service.FileService;
import com.jobjob.albaing.service.FirebaseFileServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${upload-img}")
    private String uploadPath;

    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        registry.addResourceHandler("/uploaded/**")
                .addResourceLocations("file:"+uploadPath+"/");
    }
    @Bean
//    @CrossOrigin(origins = {"http://localhost:3000", "https://your-production-domain.com"})
    public FileService fileService() {
        return new FirebaseFileServiceImpl();
    }
}
