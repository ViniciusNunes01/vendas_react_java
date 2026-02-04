package io.github.viniciusnunes01.vendasapi.model.repository.projections;

import java.math.BigDecimal;

public interface VendaPorMes {

	Integer getMes();
	BigDecimal getValor();
	
}
