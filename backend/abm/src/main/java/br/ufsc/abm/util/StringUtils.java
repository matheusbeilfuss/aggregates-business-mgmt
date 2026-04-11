package br.ufsc.abm.util;

import java.text.Normalizer;

public class StringUtils {

	private StringUtils() {
	}

	public static String normalizeName(String name) {
		return Normalizer
				.normalize(name.trim(), Normalizer.Form.NFD)
				.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
				.replaceAll("\\s+", " ")
				.toLowerCase();
	}
}
