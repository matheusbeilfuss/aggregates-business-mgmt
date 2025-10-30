package br.ufsc.aggregare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Phone;

public interface PhoneRepository extends JpaRepository<Phone, Long> {

	List<Phone> findByClientId(Long clientId);

	@Transactional
	void deleteAllByClientId(Long clientId);
}
