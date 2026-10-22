package com.restaurante.controller;

import com.restaurante.model.*;
import com.restaurante.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ComandaController {

    @Autowired private ComandaRepository comandaRepo;
    @Autowired private MesaRepository mesaRepo;
    @Autowired private ProductoRepository productoRepo;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/mesas")
    public List<Mesa> getMesas() {
        return mesaRepo.findAll();
    }

    @GetMapping("/productos")
    public List<Producto> getProductos() {
        return productoRepo.findAll();
    }

    @GetMapping("/comandas/cocina")
    public List<Comanda> getComandasCocina() {
        return comandaRepo.findByEstadoNot("ATENDIDO");
    }

    @PostMapping("/comandas")
    public ResponseEntity<?> crearComanda(@RequestBody Comanda comanda) {
        try {
            if (comanda.getMesa() == null || comanda.getMesa().getId() == null) {
                return ResponseEntity.badRequest().body("Mesa no especificada");
            }

            Mesa mesa = mesaRepo.findById(comanda.getMesa().getId())
                    .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
            
            mesa.setEstado("OCUPADA");
            mesaRepo.save(mesa);
            comanda.setMesa(mesa);

            if (comanda.getFechaHora() == null) {
                comanda.setFechaHora(LocalDateTime.now());
            }

            BigDecimal total = BigDecimal.ZERO;
            if (comanda.getDetalles() != null) {
                for (DetalleComanda d : comanda.getDetalles()) {
                    // ASIGNACIÓN CLAVE: Vincular la comanda padre a cada detalle
                    d.setComanda(comanda);

                    if (d.getProducto() != null && d.getProducto().getId() != null) {
                        Producto p = productoRepo.findById(d.getProducto().getId()).orElseThrow();
                        d.setProducto(p);
                        if (d.getPrecioUnitario() == null) {
                            d.setPrecioUnitario(p.getPrecio());
                        }
                        total = total.add(d.getPrecioUnitario().multiply(new BigDecimal(d.getCantidad())));
                    }
                }
            }
            comanda.setTotal(total);

            // Guardar Comanda en MySQL
            Comanda guardada = comandaRepo.save(comanda);

            try {
                messagingTemplate.convertAndSend("/topic/cocina", guardada);
            } catch (Exception ignored) {}

            return ResponseEntity.ok(guardada);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/comandas/{id}/estado")
    public Comanda cambiarEstado(@PathVariable Long id, @RequestParam String nuevoEstado) {
        Comanda comanda = comandaRepo.findById(id).orElseThrow();
        comanda.setEstado(nuevoEstado);
        Comanda actualizada = comandaRepo.save(comanda);

        try {
            messagingTemplate.convertAndSend("/topic/cocina", actualizada);
        } catch (Exception ignored) {}

        return actualizada;
    }

    @GetMapping("/comandas/precuenta/{mesaId}")
    public List<Comanda> getPrecuentaMesa(@PathVariable Long mesaId) {
        return comandaRepo.findByMesaIdAndEstadoNot(mesaId, "ATENDIDO");
    }
}