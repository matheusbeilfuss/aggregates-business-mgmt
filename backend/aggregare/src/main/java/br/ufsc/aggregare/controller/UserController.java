package br.ufsc.aggregare.controller;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Principal;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.model.dto.PasswordUpdateDTO;
import br.ufsc.aggregare.model.dto.UserResponseDTO;
import br.ufsc.aggregare.service.UserService;

@RestController
@RequestMapping(value = "/users")
public class UserController {

	private final UserService service;

	@Autowired
	public UserController(UserService service) {
		this.service = service;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<UserResponseDTO> insert(@RequestPart("user") User user, @RequestPart("image") MultipartFile image) {
		user = service.insert(user, image);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(user.getId()).toUri();
		return ResponseEntity.created(uri).body(new UserResponseDTO(user));
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<UserResponseDTO> update(@PathVariable Long id, @RequestPart("user") User user, @RequestPart(value = "image", required = false) MultipartFile image) {
		user = service.update(id, user, image);
		return ResponseEntity.ok().body(new UserResponseDTO(user));
	}

	@PatchMapping(value = "/{id}/password")
	public ResponseEntity<Void> updatePassword(@PathVariable Long id, @RequestBody PasswordUpdateDTO newPassword) {
		service.updatePassword(id, newPassword);
		return ResponseEntity.noContent().build();
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
		User user = service.findById(id);
		return ResponseEntity.ok().body(new UserResponseDTO(user));
	}

	@GetMapping
	public ResponseEntity<List<UserResponseDTO>> findAll() {
		List<UserResponseDTO> list = service.findAll()
				.stream()
				.map(UserResponseDTO::new)
				.toList();

		return ResponseEntity.ok(list);
	}

	@GetMapping(value = "/me")
	public ResponseEntity<UserResponseDTO> findMe(Principal principal) {
		User user = (User) service.loadUserByUsername(principal.getName());
		return ResponseEntity.ok().body(new UserResponseDTO(user));
	}

	@GetMapping("/me/avatar")
	public ResponseEntity<Resource> findMyAvatar(Principal principal) {

		Resource resource = service.loadUserAvatarResource(principal);

		if (resource == null) {
			return ResponseEntity.notFound().build();
		}

		MediaType mediaType = service.getUserAvatarMediaType(principal);

		return ResponseEntity.ok()
				.contentType(mediaType)
				.header("Cache-Control", "max-age=86400")
				.body(resource);
	}
}
