package io.github.viniciusnunes01.vendasapi.util.relatorios;

import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;

public class JasperExportUtil {

	public static byte[] exportarParaPdf(InputStream jrxmlStream, Connection connection, Map<String, Object> parametros)
			throws JRException {

		// 1. Compila o relatório
		JasperReport report = JasperCompileManager.compileReport(jrxmlStream);

		// 2. Preenche com os dados e os parâmetros recebidos
		JasperPrint print = JasperFillManager.fillReport(report, parametros, connection);

		// 3. Exporta para PDF
		return JasperExportManager.exportReportToPdf(print);
	}
}