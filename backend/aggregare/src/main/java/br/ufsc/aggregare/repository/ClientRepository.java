package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
