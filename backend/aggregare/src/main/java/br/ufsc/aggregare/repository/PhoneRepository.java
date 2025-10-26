package br.ufsc.aggregare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Phone;

public interface PhoneRepository extends JpaRepository<Phone, Long> {
	List<Phone> findByClientId(Long clientId);
}
