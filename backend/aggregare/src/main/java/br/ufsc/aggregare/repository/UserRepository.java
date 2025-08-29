package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
