package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.ufsc.aggregare.model.Settings;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
}
