package br.ufsc.aggregare.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;

	public User insert(User user) {
		return repository.save(user);
	}

	public List<User> findAll() {
		return repository.findAll();
	}
}
