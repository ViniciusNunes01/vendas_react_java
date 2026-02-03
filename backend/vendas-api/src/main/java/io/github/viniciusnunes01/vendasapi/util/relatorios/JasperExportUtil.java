package io.github.viniciusnunes01.vendasapi.util.relatorios;

import java.io.InputStream;
import java.sql.Connection;
import java.util.HashMap;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;

public class JasperExportUtil {

	public static byte[] exportarParaPdf(InputStream jrxmlStream, Connection connection) throws JRException {
		// 1. Compila o relatório (JRXML -> Jasper)
		JasperReport report = JasperCompileManager.compileReport(jrxmlStream);

		// 2. Preenche com os dados do banco (sem parâmetros por enquanto)
		JasperPrint print = JasperFillManager.fillReport(report, new HashMap<>(), connection);

		// 3. Exporta para o array de bytes do PDF
		return JasperExportManager.exportReportToPdf(print);
	}

}
