package com.freedo.virtualconstructiondataprocessing;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.freedo.virtualconstructiondataprocessing.dao")
public class VirtualConstructionDataProcessingApplication {

	public static void main(String[] args) {
		SpringApplication.run(VirtualConstructionDataProcessingApplication.class, args);
	}
}
