package br.ufsc.abm.service;

import static br.ufsc.abm.util.StringUtils.normalizeName;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.abm.model.Address;
import br.ufsc.abm.model.Client;
import br.ufsc.abm.model.Phone;
import br.ufsc.abm.model.dto.ClientInputDTO;
import br.ufsc.abm.model.dto.PhoneDTO;
import br.ufsc.abm.repository.ClientRepository;
import br.ufsc.abm.service.exception.DatabaseException;
import br.ufsc.abm.service.exception.ResourceNotFoundException;
import br.ufsc.abm.validator.ClientValidator;

@Service
public class ClientService {

	private final ClientRepository repository;
	private final ClientValidator validator;

	@Autowired
	public ClientService(ClientRepository repository, ClientValidator validator) {
		this.repository = repository;
		this.validator = validator;
	}

	@Transactional
	public Client insert(ClientInputDTO dto) {
		validator.validateInsert(dto);

		Client client = clientFromDTO(dto);

		if (dto.hasAnyAddressField()) {
			Address address = addressFromDTO(dto, client);
			client.setAddress(address);
		}

		List<Phone> phones = phonesFromDTO(client, dto);
		for (Phone phone : phones) {
			client.addPhone(phone);
		}

		return repository.save(client);
	}

	@Transactional
	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new ResourceNotFoundException(id);
		}
		try {
			repository.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	@Transactional
	public Client update(Long id, ClientInputDTO dto) {
		validator.validateUpdate(id, dto);

		Client existingClient = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		existingClient.setName(dto.getName());
		existingClient.setNameNormalized(normalizeName(dto.getName()));
		existingClient.setEmail(dto.getEmail());
		existingClient.setCpfCnpj(dto.getCpfCnpj());

		if (dto.hasAnyAddressField()) {
			Address newAddressData = addressFromDTO(dto, existingClient);
			if (existingClient.getAddress() == null) {
				existingClient.setAddress(newAddressData);
			} else {
				Address addr = existingClient.getAddress();
				addr.setStreet(newAddressData.getStreet());
				addr.setNumber(newAddressData.getNumber());
				addr.setCity(newAddressData.getCity());
				addr.setState(newAddressData.getState());
				addr.setNeighborhood(newAddressData.getNeighborhood());
				addr.setComplement(newAddressData.getComplement());
				addr.setCep(newAddressData.getCep());
			}
		} else {
			existingClient.setAddress(null);
		}

		new ArrayList<>(existingClient.getPhones()).forEach(existingClient::removePhone);

		List<Phone> newPhones = phonesFromDTO(existingClient, dto);
		for (Phone phone : newPhones) {
			existingClient.addPhone(phone);
		}

		return repository.save(existingClient);
	}

	public Client findById(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Client> findAll() {
		return repository.findAll();
	}

	public List<Client> searchByName(String search) {
		return repository.findByNameNormalized(normalizeName(search));
	}

	public Client clientFromDTO(ClientInputDTO dto) {
		Client client = new Client();
		client.setName(dto.getName());
		client.setNameNormalized(normalizeName(dto.getName()));
		client.setEmail(dto.getEmail());
		client.setCpfCnpj(dto.getCpfCnpj());
		return client;
	}

	public Address addressFromDTO(ClientInputDTO dto, Client client) {
		Address address = new Address();
		address.setState(dto.getState());
		address.setCity(dto.getCity());
		address.setNeighborhood(dto.getNeighborhood());
		address.setStreet(dto.getStreet());
		address.setNumber(dto.getNumber());
		address.setComplement(dto.getComplement());
		address.setCep(dto.getCep());
		address.setClient(client);
		return address;
	}

	public List<Phone> phonesFromDTO(Client client, ClientInputDTO dto) {
		List<Phone> phones = new ArrayList<>();
		for (PhoneDTO phoneDTO : dto.getPhones()) {
			Phone phone = new Phone();
			phone.setNumber(phoneDTO.getNumber());
			phone.setType(phoneDTO.getType());
			phone.setClient(client);
			phones.add(phone);
		}
		return phones;
	}
}
