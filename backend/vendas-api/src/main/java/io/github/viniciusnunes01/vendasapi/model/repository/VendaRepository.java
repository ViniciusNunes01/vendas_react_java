package io.github.viniciusnunes01.vendasapi.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.viniciusnunes01.vendasapi.model.Venda;

public interface VendaRepository extends JpaRepository<Venda, Long> {

}
