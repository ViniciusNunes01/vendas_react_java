package io.github.viniciusnunes01.vendasapi.service.relatorios;

import java.sql.Connection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import io.github.viniciusnunes01.vendasapi.util.relatorios.JasperExportUtil;

@Service
public class RelatorioVendasService {

	@Value("classpath:reports/relatorio-vendas.jrxml")
	private Resource relatorioVendasSource;

	@Autowired
	private DataSource dataSource;

	public byte[] gerarRelatorio(Long idCliente, Date dataInicio, Date dataFim) {
		try (Connection connection = dataSource.getConnection()) {
			Map<String, Object> parametros = new HashMap<>();

			// Garante que o ID_CLIENTE vá como null se for 0, para cair no filtro do SQL
			parametros.put("ID_CLIENTE", (idCliente != null && idCliente > 0) ? idCliente : null);

			// Converte java.util.Date para java.sql.Timestamp para evitar o
			// ClassCastException
			parametros.put("DATA_INICIO", new java.sql.Timestamp(dataInicio.getTime()));
			parametros.put("DATA_FIM", new java.sql.Timestamp(dataFim.getTime()));

			return JasperExportUtil.exportarParaPdf(relatorioVendasSource.getInputStream(), connection, parametros);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
