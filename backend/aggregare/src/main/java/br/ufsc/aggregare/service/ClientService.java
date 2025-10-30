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
import br.ufsc.aggregare.model.dto.ClientDTO;
import br.ufsc.aggregare.model.dto.ClientInputDTO;
import br.ufsc.aggregare.model.dto.PhoneDTO;
import br.ufsc.aggregare.repository.AddressRepository;
import br.ufsc.aggregare.repository.ClientRepository;
import br.ufsc.aggregare.repository.PhoneRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

@Service
public class ClientService {

	private final ClientRepository repository;
	private final AddressRepository addressRepository;
	private final PhoneRepository phoneRepository;

	@Autowired
	public ClientService(ClientRepository repository, AddressRepository addressRepository, PhoneRepository phoneRepository) {
		this.repository = repository;
		this.addressRepository = addressRepository;
		this.phoneRepository = phoneRepository;
	}

	public Client insert(ClientInputDTO dto) {
		Client savedClient = repository.save(clientFromDTO(dto));

		Address address = addressFromDTO(dto, savedClient);
		addressRepository.save(address);

		List<Phone> phones = phonesFromDTO(savedClient, dto);
		phoneRepository.saveAll(phones);

		return savedClient;
	}

	@Transactional
	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new ResourceNotFoundException(id);
		}

		try {
			phoneRepository.deleteAllByClientId(id);
			addressRepository.deleteByClientId(id);
			repository.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	public ClientDTO findById(Long id) {
		Client client = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
		Address address = addressRepository.findByClientId(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
		List<Phone> phones = phoneRepository.findByClientId(id);

		return new ClientDTO(client, address, phones);
	}

	public List<Client> findAll() {
		return repository.findAll();
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
