package br.ufsc.aggregare.service;

import java.nio.file.Path;
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
import br.ufsc.aggregare.model.dto.CreateUserDTO;
import br.ufsc.aggregare.model.dto.PasswordUpdateDTO;
import br.ufsc.aggregare.model.dto.UpdateUserDTO;
import br.ufsc.aggregare.repository.UserRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ForbiddenException;
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

	public User insert(CreateUserDTO dto, MultipartFile image) {
		if (repository.existsByUsername(dto.getUsername())) {
			throw new DatabaseException("Nome de usuário já existe.");
		}

		if (repository.existsByEmail(dto.getEmail())) {
			throw new DatabaseException("Email já existe.");
		}

		User user = fromCreateUserDTO(dto);

		if (image != null && !image.isEmpty()) {
			String imgName = fileService.saveImage(image);
			user.setImgName(imgName);
		}

		return repository.save(user);
	}

	private User fromCreateUserDTO(CreateUserDTO dto) {
		User user = new User();
		user.setFirstName(dto.getFirstName());
		user.setLastName(dto.getLastName());
		user.setUsername(dto.getUsername());
		user.setEmail(dto.getEmail());
		user.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
		user.setAdmin(dto.getAdmin() != null && dto.getAdmin());
		return user;
	}

	public void delete(Long id, User loggedUser) {
		if (loggedUser.getId().equals(id)) {
			throw new ForbiddenException("Você não pode deletar sua própria conta.");
		}

		boolean isAdmin = loggedUser.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

		if (!isAdmin) {
			throw new ForbiddenException("Você não tem permissão para deletar usuários.");
		}

		try {
			User user = findById(id);

			if (user.getImgName() != null && !user.getImgName().isEmpty()) {
				fileService.deleteImage(user.getImgName());
			}

			repository.delete(user);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public User update(Long id, UpdateUserDTO dto, MultipartFile image, User loggedUser) {
		boolean isSelf = loggedUser.getId().equals(id);
		boolean isAdmin = loggedUser.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

		if (!isSelf && !isAdmin) {
			throw new ForbiddenException("Você não tem permissão para editar este usuário.");
		}

		try {
			User existingUser = repository.getReferenceById(id);

			if (!existingUser.getUsername().equals(dto.getUsername())
					&& repository.existsByUsername(dto.getUsername())) {
				throw new DatabaseException("Nome de usuário já existe.");
			}

			if (!existingUser.getEmail().equals(dto.getEmail())
					&& repository.existsByEmail(dto.getEmail())) {
				throw new DatabaseException("Email já existe.");
			}

			existingUser.setFirstName(dto.getFirstName());
			existingUser.setLastName(dto.getLastName());
			existingUser.setUsername(dto.getUsername());
			existingUser.setEmail(dto.getEmail());

			if (image != null && !image.isEmpty()) {
				String oldImgName = existingUser.getImgName();
				String newImgName = fileService.saveImage(image);
				existingUser.setImgName(newImgName);

				if (oldImgName != null && !oldImgName.isEmpty()) {
					fileService.deleteImage(oldImgName);
				}
			}

			return repository.save(existingUser);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updatePassword(Long id, PasswordUpdateDTO newPassword) {
		try {
			User user = repository.getReferenceById(id);
			user.setPassword(bCryptPasswordEncoder.encode(newPassword.getNewPassword()));
			repository.save(user);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
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

	public boolean existsByUsername(String username) {
		return repository.existsByUsername(username);
	}

	public Resource loadUserAvatarResource(User user) {

		if (user.getImgName() == null || user.getImgName().isEmpty()) {
			return null;
		}

		Path filePath = fileService.getFilePath(user.getImgName());

		return fileService.loadFileAsResource(filePath);
	}

	public MediaType getUserAvatarMediaType(User user) {

		if (user.getImgName() == null || user.getImgName().isEmpty()) {
			return null;
		}

		Path filePath = fileService.getFilePath(user.getImgName());

		return fileService.getFileMediaType(filePath);
	}
}
