package com.restaurante.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mesas")
public class Mesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_mesa", nullable = false, unique = true)
    private Integer numeroMesa;

    private String estado; // "LIBRE", "OCUPADA", "CUENTA"

    public Mesa() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getNumeroMesa() { return numeroMesa; }
    public void setNumeroMesa(Integer numeroMesa) { this.numeroMesa = numeroMesa; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}