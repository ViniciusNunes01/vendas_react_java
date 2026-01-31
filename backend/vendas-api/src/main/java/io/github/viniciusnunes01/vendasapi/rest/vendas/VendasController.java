package io.github.viniciusnunes01.vendasapi.rest.vendas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.viniciusnunes01.vendasapi.model.Venda;
import io.github.viniciusnunes01.vendasapi.model.repository.ItemVendaRepository;
import io.github.viniciusnunes01.vendasapi.model.repository.VendaRepository;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin("*")
public class VendasController {

	@Autowired
	private VendaRepository repository;

	@Autowired
	private ItemVendaRepository itemVendaRepository;

	@PostMapping
	@Transactional
	public void realizarVenda(@RequestBody Venda venda) {

		repository.save(venda);
		venda.getItens().stream().forEach(itemVenda -> itemVenda.setVenda(venda));
		itemVendaRepository.saveAll(venda.getItens());
	}

}
