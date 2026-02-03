package io.github.viniciusnunes01.vendasapi.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum FormaPagamento {
	DINHEIRO,
	CARTAO;
	
	@JsonCreator
    public static FormaPagamento fromString(String value) {
        if (value == null) return null;
        // Remove acentos e converte para maiúsculo para comparar
        String normalized = value.toUpperCase()
                                 .replace("Ã", "A")
                                 .replace("Õ", "O");
        return FormaPagamento.valueOf(normalized);
    }
}
