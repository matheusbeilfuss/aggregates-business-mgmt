package br.ufsc.abm.validator;

import static br.ufsc.abm.util.StringUtils.isNotBlank;

import br.ufsc.abm.model.dto.ClientInputDTO;
import br.ufsc.abm.repository.ClientRepository;
import br.ufsc.abm.service.exception.DatabaseException;
import br.ufsc.abm.validator.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class ClientValidator {

	private final ClientRepository clientRepository;

	public ClientValidator(ClientRepository clientRepository) {
		this.clientRepository = clientRepository;
	}

	public void validateInsert(ClientInputDTO dto) {
		validateCpfCnpjUniqueness(dto.getCpfCnpj(), null);
		validateAddress(dto);
	}

	public void validateUpdate(Long id, ClientInputDTO dto) {
		validateCpfCnpjUniqueness(dto.getCpfCnpj(), id);

		if (dto.isRemoveAddress() && dto.hasAnyAddressField()) {
			throw new ValidationException(
					"Não é possível remover e informar um endereço ao mesmo tempo.");
		}

		validateAddress(dto);
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

	private void validateAddress(ClientInputDTO dto) {
		if (!dto.hasAnyAddressField()) return;

		if (!isNotBlank(dto.getStreet()))
			throw new ValidationException("A rua é obrigatória quando o endereço é informado.");
		if (!isNotBlank(dto.getNumber()))
			throw new ValidationException("O número é obrigatório quando o endereço é informado.");
		if (!isNotBlank(dto.getNeighborhood()))
			throw new ValidationException("O bairro é obrigatório quando o endereço é informado.");
		if (!isNotBlank(dto.getCity()))
			throw new ValidationException("A cidade é obrigatória quando o endereço é informado.");
		if (!isNotBlank(dto.getState()) || dto.getState().trim().length() < 2)
			throw new ValidationException("O estado é obrigatório quando o endereço é informado.");
	}
}
