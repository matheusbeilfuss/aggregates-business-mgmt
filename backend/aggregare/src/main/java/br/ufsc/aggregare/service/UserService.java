package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.UserRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

	private final UserRepository repository;
	private final FileService fileService;

	@Autowired
	public UserService(UserRepository repository, FileService fileService) {
		this.repository = repository;
		this.fileService = fileService;
	}

	public User insert(User user, MultipartFile image) {
		String imgUrl = fileService.saveImage(image);
		user.setImgUrl(imgUrl);
		return repository.save(user);
	}

	public void delete(Long id) {
		try {
			User user = findById(id);

			if (user.getImgUrl() != null && !user.getImgUrl().isEmpty()) {
				fileService.deleteImage(user.getImgUrl());
			}

			repository.delete(user);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public User update(Long id, User newUser, MultipartFile image) {
		try {
			User existingUser = repository.getReferenceById(id);
			String oldImgUrl = existingUser.getImgUrl();

			if (image != null && !image.isEmpty()) {
				String newImgUrl = fileService.saveImage(image);
				newUser.setImgUrl(newImgUrl);

				if (oldImgUrl != null && !oldImgUrl.isEmpty()) {
					fileService.deleteImage(oldImgUrl);
				}
			}

			updateData(existingUser, newUser);
			return repository.save(existingUser);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updateData(User existingUser, User newUser) {
		existingUser.setFirstName(newUser.getFirstName());
		existingUser.setLastName(newUser.getLastName());
		existingUser.setUsername(newUser.getUsername());
		existingUser.setEmail(newUser.getEmail());
		existingUser.setPassword(newUser.getPassword());
		existingUser.setImgUrl(newUser.getImgUrl());
	}

	public User findById(Long id) {
		Optional<User> user = repository.findById(id);
		return user.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<User> findAll() {
		return repository.findAll();
	}
}
