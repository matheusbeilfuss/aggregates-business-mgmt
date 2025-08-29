package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.UserRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

	private final UserRepository repository;

	@Autowired
	public UserService(UserRepository repository) {
		this.repository = repository;
	}

	public User insert(User user) {
		return repository.save(user);
	}

	public void delete(Long id) {
		try {
			User user = findById(id);
			repository.delete(user);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public User update(Long id, User newUser) {
		try {
			User user = repository.getReferenceById(id);
			updateData(user, newUser);
			return repository.save(user);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updateData(User user, User newUser) {
		user.setFirstName(newUser.getFirstName());
		user.setLastName(newUser.getLastName());
		user.setUsername(newUser.getUsername());
		user.setEmail(newUser.getEmail());
		user.setPassword(newUser.getPassword());
		user.setImgUrl(newUser.getImgUrl());
	}

	public User findById(Long id) {
		Optional<User> user = repository.findById(id);
		return user.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<User> findAll() {
		return repository.findAll();
	}
}
