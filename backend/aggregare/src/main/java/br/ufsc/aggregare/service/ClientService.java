package br.ufsc.aggregare.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Address;
import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.Phone;
import br.ufsc.aggregare.model.dto.ClientInputDTO;
import br.ufsc.aggregare.model.dto.PhoneDTO;
import br.ufsc.aggregare.repository.ClientRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

@Service
public class ClientService {

	private final ClientRepository repository;

	@Autowired
	public ClientService(ClientRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public Client insert(ClientInputDTO dto) {
		if (dto.getCpfCnpj() != null && repository.existsByCpfCnpj(dto.getCpfCnpj())) {
			throw new DatabaseException("Cliente já cadastrado com esse CPF/CNPJ");
		}

		Client client = clientFromDTO(dto);

		Address address = addressFromDTO(dto, client);
		client.setAddress(address);

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
		Client existingClient = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		existingClient.setName(dto.getName());
		existingClient.setEmail(dto.getEmail());
		existingClient.setCpfCnpj(dto.getCpfCnpj());

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
		}

		existingClient.getPhones().clear();

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
		return repository.findByNameContainingIgnoreCase(search);
	}

	public Client clientFromDTO(ClientInputDTO dto) {
		Client client = new Client();
		client.setName(dto.getName());
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
