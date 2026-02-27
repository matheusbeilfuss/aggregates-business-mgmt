package br.ufsc.aggregare.validator;

import br.ufsc.aggregare.model.dto.OrderInputDTO;
import br.ufsc.aggregare.model.enums.OrderTypeEnum;
import br.ufsc.aggregare.validator.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class OrderValidator {

	public void validate(OrderInputDTO dto) {
		if (dto.getType() == OrderTypeEnum.MATERIAL) {
			validateMaterialOrder(dto);
		} else if (dto.getType() == OrderTypeEnum.SERVICE) {
			validateServiceOrder(dto);
		} else {
			throw new ValidationException("Tipo de pedido inválido ou não informado.");
		}
	}

	private void validateMaterialOrder(OrderInputDTO dto) {
		if (dto.getProductId() == null) {
			throw new ValidationException("Pedido do tipo MATERIAL deve conter um produto.");
		}
		if (dto.getM3Quantity() == null || dto.getM3Quantity() <= 0) {
			throw new ValidationException("Pedido do tipo MATERIAL deve conter uma quantidade válida.");
		}
	}

	private void validateServiceOrder(OrderInputDTO dto) {
		if (dto.getService() == null || dto.getService().isBlank()) {
			throw new ValidationException("Pedido do tipo SERVIÇO deve conter uma descrição do serviço.");
		}
	}
}
