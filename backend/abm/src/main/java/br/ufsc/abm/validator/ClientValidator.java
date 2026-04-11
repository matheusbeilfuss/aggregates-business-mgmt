package br.ufsc.abm.validator;

import br.ufsc.abm.model.dto.ClientInputDTO;
import br.ufsc.abm.repository.ClientRepository;
import br.ufsc.abm.service.exception.DatabaseException;
import org.springframework.stereotype.Component;

@Component
public class ClientValidator {

	private final ClientRepository clientRepository;

	public ClientValidator(ClientRepository clientRepository) {
		this.clientRepository = clientRepository;
	}

	public void validateInsert(ClientInputDTO dto) {
		validateCpfCnpjUniqueness(dto.getCpfCnpj(), null);
	}

	public void validateUpdate(Long id, ClientInputDTO dto) {
		validateCpfCnpjUniqueness(dto.getCpfCnpj(), id);
	}

	private void validateCpfCnpjUniqueness(String cpfCnpj, Long excludeId) {
		if (cpfCnpj == null || cpfCnpj.isBlank()) return;

		boolean exists = excludeId == null
				? clientRepository.existsByCpfCnpj(cpfCnpj)
				: clientRepository.existsByCpfCnpjAndIdNot(cpfCnpj, excludeId);

		if (exists) {
			throw new DatabaseException("Já existe um cliente cadastrado com esse CPF/CNPJ.");
		}
	}
}
