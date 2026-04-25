package com.simba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SimbaMarketApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimbaMarketApplication.class, args);
	}

}
