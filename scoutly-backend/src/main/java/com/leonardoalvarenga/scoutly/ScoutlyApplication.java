package com.leonardoalvarenga.scoutly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ScoutlyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScoutlyApplication.class, args);
	}

}
