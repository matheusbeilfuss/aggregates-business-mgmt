package br.ufsc.abm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.abm.model.Phone;

public interface PhoneRepository extends JpaRepository<Phone, Long> {

}
