package br.ufsc.aggregare.validator;

import br.ufsc.aggregare.model.dto.UserInsertDTO;
import br.ufsc.aggregare.model.dto.UserUpdateDTO;
import br.ufsc.aggregare.repository.UserRepository;
import br.ufsc.aggregare.validator.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class UserValidator {

	private final UserRepository userRepository;

	public UserValidator(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public void validateInsert(UserInsertDTO dto) {
		if (userRepository.existsByUsername(dto.getUsername())) {
			throw new ValidationException("Nome de usuário já existe.");
		}
		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new ValidationException("Email já existe.");
		}
	}

	public void validateUpdate(Long id, UserUpdateDTO dto) {
		if (userRepository.existsByUsernameAndIdNot(dto.getUsername(), id)) {
			throw new ValidationException("Nome de usuário já existe.");
		}
		if (userRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
			throw new ValidationException("Email já existe.");
		}
	}
}
