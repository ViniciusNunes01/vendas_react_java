package io.github.viniciusnunes01.vendasapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class VendasApiApplication {

	@Autowired
	private Environment env;

	@GetMapping("/")
	private String getAmbiente() {

		String ambienteAtual = "PADRÃO (nenhum) ";

		if (env.getActiveProfiles().length > 0) {
			ambienteAtual = env.getActiveProfiles()[0];
		}

		String appName = env.getProperty("spring.application.name");

		return String.format("Ambiente: %s | App Name: %s", ambienteAtual, appName);
	}

	public static void main(String[] args) {
		SpringApplication.run(VendasApiApplication.class, args);
	}

}
