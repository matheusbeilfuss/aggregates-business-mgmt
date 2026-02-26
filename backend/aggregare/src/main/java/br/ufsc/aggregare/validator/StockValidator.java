package br.ufsc.aggregare.validator;

import br.ufsc.aggregare.model.dto.StockReplenishDTO;
import br.ufsc.aggregare.validator.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class StockValidator {

	public void validateReplenish(StockReplenishDTO dto) {
		if (dto.getTonQuantity() != null && dto.getM3Quantity() != null) {
			if (dto.getTonQuantity() > 0 && dto.getM3Quantity() <= 0) {
				throw new ValidationException(
						"Se a quantidade em toneladas foi informada, a quantidade em m³ também deve ser maior que zero.");
			}
			if (dto.getM3Quantity() > 0 && dto.getTonQuantity() <= 0) {
				throw new ValidationException(
						"Se a quantidade em m³ foi informada, a quantidade em toneladas também deve ser maior que zero.");
			}
		}
	}
}
