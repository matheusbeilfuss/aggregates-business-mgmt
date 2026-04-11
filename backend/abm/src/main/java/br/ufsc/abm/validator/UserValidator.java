package br.ufsc.abm.validator;

import br.ufsc.abm.model.dto.UserInsertDTO;
import br.ufsc.abm.model.dto.UserUpdateDTO;
import br.ufsc.abm.repository.UserRepository;
import br.ufsc.abm.service.exception.DatabaseException;
import org.springframework.stereotype.Component;

@Component
public class UserValidator {

	private final UserRepository userRepository;

	public UserValidator(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public void validateInsert(UserInsertDTO dto) {
		if (userRepository.existsByUsername(dto.getUsername())) {
			throw new DatabaseException("Nome de usuário já existe.");
		}
		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new DatabaseException("Email já existe.");
		}
	}

	public void validateUpdate(Long id, UserUpdateDTO dto) {
		if (userRepository.existsByUsernameAndIdNot(dto.getUsername(), id)) {
			throw new DatabaseException("Nome de usuário já existe.");
		}
		if (userRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
			throw new DatabaseException("Email já existe.");
		}
	}
}
