package br.ufsc.aggregare.validator;

import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.validator.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class ExpenseValidator {

	public void validate(ExpenseInputDTO dto) {
		if (ExpenseTypeEnum.FUEL.equals(dto.getType())) {
			validateFuelExpense(dto);
		}
	}

	private void validateFuelExpense(ExpenseInputDTO dto) {
		if (dto.getVehicle() == null || dto.getVehicle().isBlank()) {
			throw new ValidationException("Despesa do tipo COMBUSTÍVEL deve conter o veículo.");
		}
		if (dto.getLiters() == null || dto.getLiters() <= 0) {
			throw new ValidationException("Despesa do tipo COMBUSTÍVEL deve conter a quantidade de litros.");
		}
		if (dto.getPricePerLiter() == null || dto.getPricePerLiter() <= 0) {
			throw new ValidationException("Despesa do tipo COMBUSTÍVEL deve conter o preço por litro.");
		}
		if (dto.getKmDriven() == null || dto.getKmDriven() <= 0) {
			throw new ValidationException("Despesa do tipo COMBUSTÍVEL deve conter os km rodados.");
		}
	}
}
