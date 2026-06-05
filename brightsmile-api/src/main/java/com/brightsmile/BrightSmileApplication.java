package com.brightsmile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BrightSmileApplication {
    public static void main(String[] args) {
        SpringApplication.run(BrightSmileApplication.class, args);
    }
}
