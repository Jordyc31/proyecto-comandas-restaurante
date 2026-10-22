package com.restaurante.repository;

import com.restaurante.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, Long> {
    List<Comanda> findByEstadoNot(String estado);
    List<Comanda> findByMesaIdAndEstadoNot(Long mesaId, String estado);
}