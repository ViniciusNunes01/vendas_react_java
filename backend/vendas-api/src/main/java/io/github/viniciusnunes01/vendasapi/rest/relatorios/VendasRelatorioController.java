package io.github.viniciusnunes01.vendasapi.rest.relatorios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.github.viniciusnunes01.vendasapi.service.relatorios.RelatorioVendasService;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin("*")
public class VendasRelatorioController {

	@Autowired
	private RelatorioVendasService relatorioVendasService;

	@GetMapping("/relatorio-vendas")
	public ResponseEntity<byte[]> relatorioVendas(

			@RequestParam(value = "id", required = false, defaultValue = "0") Long id,
			@RequestParam(value = "inicio", required = false, defaultValue = "") String inicio,
			@RequestParam(value = "fim", required = false, defaultValue = "") String fim

	) {

		byte[] relatorioGerado = relatorioVendasService.gerarRelatorio(id, inicio, fim);

		HttpHeaders headers = new HttpHeaders();
		var fileName = "relatorio-vendas.pdf";

		// inline; filename="relatorio-vendas.pdf"
		headers.setContentDispositionFormData("inline; filename=\"" + fileName + "\"", fileName);

		headers.setCacheControl("must-revalidade, post-check=0, pre-check=0");

		var responseEntity = new ResponseEntity<>(relatorioGerado, headers, HttpStatus.OK);

		return responseEntity;
	}
}
