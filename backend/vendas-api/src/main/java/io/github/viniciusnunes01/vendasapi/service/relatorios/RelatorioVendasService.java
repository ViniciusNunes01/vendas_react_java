package io.github.viniciusnunes01.vendasapi.service.relatorios;

import java.sql.Connection;

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

    public byte[] gerarRelatorio() {
        try (Connection connection = dataSource.getConnection()) {
            return JasperExportUtil.exportarParaPdf(relatorioVendasSource.getInputStream(), connection);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
