package br.ufsc.abm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.ufsc.abm.model.Settings;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
}
