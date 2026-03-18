package com.hgw.gestionale.statoriparazione.repository;

import com.hgw.gestionale.statoriparazione.entity.StatoRiparazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatoRiparazioneRepository extends JpaRepository<StatoRiparazione, Long> {
}
