package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Supplier;
import br.ufsc.aggregare.repository.SupplierRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SupplierService {

	private final SupplierRepository repository;

	@Autowired
	public SupplierService(SupplierRepository repository) {
		this.repository = repository;
	}

	public Supplier insert(Supplier supplier) {
		return repository.save(supplier);
	}

	public void delete(Long id) {
		try {
			if (!repository.existsById(id)){
				throw new ResourceNotFoundException(id);
			}
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	public Supplier update(Long id, Supplier newSupplier) {
		try {
			Supplier existingSupplier = repository.getReferenceById(id);
			updateData(existingSupplier, newSupplier);
			return repository.save(existingSupplier);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updateData(Supplier existingSupplier, Supplier newSupplier) {
		existingSupplier.setName(newSupplier.getName());
	}

	public Supplier findById(Long id) {
		Optional<Supplier> supplier = repository.findById(id);
		return supplier.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Supplier> findAll() {
		return repository.findAll();
	}
}
