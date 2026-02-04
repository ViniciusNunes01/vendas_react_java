package io.github.viniciusnunes01.vendasapi.rest.dashboard;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.github.viniciusnunes01.vendasapi.model.repository.ClienteRepository;
import io.github.viniciusnunes01.vendasapi.model.repository.ProdutoRepository;
import io.github.viniciusnunes01.vendasapi.model.repository.VendaRepository;
import io.github.viniciusnunes01.vendasapi.service.relatorios.RelatorioVendasService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

	private final RelatorioVendasService relatorioVendasService;

	@Autowired
	private VendaRepository vendas;

	@Autowired
	private ClienteRepository clientes;

	@Autowired
	private ProdutoRepository produtos;

	DashboardController(RelatorioVendasService relatorioVendasService) {
		this.relatorioVendasService = relatorioVendasService;
	}

	@GetMapping
	public DashboardData getDashBoard(@RequestParam(value = "ano", required = false) Integer ano) {
		var anoBusca = (ano != null) ? ano : LocalDate.now().getYear();
		var vendasPorMes = vendas.obterSomatoriaVendasPorMes(anoBusca);

		long vendasCount = vendas.count();
		long clientesCount = clientes.count();
		long produtosCount = produtos.count();

		return new DashboardData(produtosCount, clientesCount, vendasCount, vendasPorMes);
	}

}
