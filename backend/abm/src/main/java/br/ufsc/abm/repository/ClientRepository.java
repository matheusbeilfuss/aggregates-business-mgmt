package br.ufsc.abm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.ufsc.abm.model.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

	@Query("SELECT c FROM Client c WHERE c.nameNormalized LIKE CONCAT('%', :search, '%')")
	List<Client> findByNameNormalized(@Param("search") String search);

	boolean existsByCpfCnpj(String cpfCnpj);

	boolean existsByCpfCnpjAndIdNot(String cpfCnpj, Long id);
}
