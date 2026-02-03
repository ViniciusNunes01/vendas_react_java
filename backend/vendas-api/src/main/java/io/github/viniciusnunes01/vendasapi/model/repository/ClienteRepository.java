package io.github.viniciusnunes01.vendasapi.model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.github.viniciusnunes01.vendasapi.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

	@Query("""
			    select c
			    from Cliente c
			    where (:nome is null or cast(unaccent(upper(c.nome)) as string) like cast(unaccent(upper(concat('%', :nome, '%'))) as string))
			      and (:cpf is null or c.cpf like concat('%', :cpf, '%'))
			    order by c.id asc
			""")
	Page<Cliente> buscarPorNomeCpf(@Param("nome") String nome, @Param("cpf") String cpf, Pageable pageable);

}