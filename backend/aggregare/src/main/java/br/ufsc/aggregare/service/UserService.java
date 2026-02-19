package br.ufsc.aggregare.service;

import java.nio.file.Path;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.UserRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService implements UserDetailsService {

	private final UserRepository repository;
	private final FileService fileService;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	public UserService(UserRepository repository, FileService fileService, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.repository = repository;
		this.fileService = fileService;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

	public User insert(User user, MultipartFile image) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
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
		existingUser.setPassword(bCryptPasswordEncoder.encode(newUser.getPassword()));
		existingUser.setImgUrl(newUser.getImgUrl());
	}

	public User findById(Long id) {
		Optional<User> user = repository.findById(id);
		return user.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<User> findAll() {
		return repository.findAll();
	}

	@Override public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = repository.findByUsername(username);

		if (user == null) {
			throw new UsernameNotFoundException("Usuário não encontrado com username: " + username);
		}

		return user;
	}

	public Resource loadUserAvatarResource(Principal principal) {
		User user = (User) loadUserByUsername(principal.getName());

		if (user.getImgUrl() == null || user.getImgUrl().isEmpty()) {
			return null;
		}

		Path filePath = fileService.getFilePath(user.getImgUrl());

		return fileService.loadFileAsResource(filePath);
	}

	public MediaType getUserAvatarMediaType(Principal principal) {
		User user = (User) loadUserByUsername(principal.getName());

		if (user.getImgUrl() == null || user.getImgUrl().isEmpty()) {
			return null;
		}

		Path filePath = fileService.getFilePath(user.getImgUrl());

		return fileService.getFileMediaType(filePath);
	}
}
