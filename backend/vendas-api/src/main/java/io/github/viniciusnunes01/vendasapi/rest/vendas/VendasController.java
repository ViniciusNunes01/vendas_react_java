package io.github.viniciusnunes01.vendasapi.rest.vendas;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.viniciusnunes01.vendasapi.model.Venda;
import io.github.viniciusnunes01.vendasapi.model.repository.VendaRepository;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin("*")
public class VendasController {
	
	private VendaRepository repository;
	
	@PostMapping
	public void realizarVenda( @RequestBody Venda venda ) {
		
		
		
	}
	
}
