package com.restaurante.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "comandas")
public class Comanda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    private String estado; // "ENVIADO", "EN_PREPARACION", "LISTO", "ATENDIDO"

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora = LocalDateTime.now();

    private BigDecimal total = BigDecimal.ZERO;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "comanda_id")
    private List<DetalleComanda> detalles;

    public Comanda() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Mesa getMesa() { return mesa; }
    public void setMesa(Mesa mesa) { this.mesa = mesa; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public List<DetalleComanda> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleComanda> detalles) { this.detalles = detalles; }
}