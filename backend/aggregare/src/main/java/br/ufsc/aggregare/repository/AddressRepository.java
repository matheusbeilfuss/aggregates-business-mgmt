package br.ufsc.aggregare.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

	Optional<Address> findByClientId(Long clientId);

	@Transactional
	void deleteByClientId(Long clientId);
}
