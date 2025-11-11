package com.almacen.peliculas.pedidos.domain;

import com.almacen.peliculas.usuarios.domain.Usuario;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@EntityListeners(AuditingEntityListener.class)
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal impuestos = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;
    
    @Column(length = 100)
    private String metodoPago;
    
    @Column(length = 100)
    private String transaccionId;
    
    @Embedded
    private Direccion direccionEnvio;
    
    @Column(length = 500)
    private String notas;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ItemPedido> items = new ArrayList<>();
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime fechaCreacion;
    
    @LastModifiedDate
    private LocalDateTime fechaActualizacion;
    
    private LocalDateTime fechaConfirmacion;
    
    private LocalDateTime fechaEnvio;
    
    private LocalDateTime fechaEntrega;
    
    // Constructores
    public Pedido() {}
    
    public Pedido(Usuario usuario) {
        this.usuario = usuario;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public EstadoPedido getEstado() {
        return estado;
    }
    
    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getImpuestos() {
        return impuestos;
    }
    
    public void setImpuestos(BigDecimal impuestos) {
        this.impuestos = impuestos;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public String getMetodoPago() {
        return metodoPago;
    }
    
    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    
    public String getTransaccionId() {
        return transaccionId;
    }
    
    public void setTransaccionId(String transaccionId) {
        this.transaccionId = transaccionId;
    }
    
    public Direccion getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(Direccion direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }
    
    public String getNotas() {
        return notas;
    }
    
    public void setNotas(String notas) {
        this.notas = notas;
    }
    
    public List<ItemPedido> getItems() {
        return items;
    }
    
    public void setItems(List<ItemPedido> items) {
        this.items = items;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
    
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
    
    public LocalDateTime getFechaConfirmacion() {
        return fechaConfirmacion;
    }
    
    public void setFechaConfirmacion(LocalDateTime fechaConfirmacion) {
        this.fechaConfirmacion = fechaConfirmacion;
    }
    
    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }
    
    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }
    
    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }
    
    public void setFechaEntrega(LocalDateTime fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }
    
    // Métodos de utilidad
    
    public void agregarItem(ItemPedido item) {
        items.add(item);
        item.setPedido(this);
        recalcularTotales();
    }
    
    public void removerItem(ItemPedido item) {
        items.remove(item);
        item.setPedido(null);
        recalcularTotales();
    }
    
    public void recalcularTotales() {
        subtotal = items.stream()
            .map(ItemPedido::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        impuestos = subtotal.multiply(BigDecimal.valueOf(0.21));
        
        total = subtotal.add(impuestos);
    }
}
