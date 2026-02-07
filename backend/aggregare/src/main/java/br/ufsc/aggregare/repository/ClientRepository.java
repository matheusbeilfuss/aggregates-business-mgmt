package br.ufsc.aggregare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

	List<Client> findByNameContainingIgnoreCase(String name);

	boolean existsByCpfCnpj(String cpfCnpj);
}
