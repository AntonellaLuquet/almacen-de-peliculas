package com.almacen.peliculas.pedidos.domain.dto;

import java.util.List;

public class CheckoutDTO {

    private DatosEnvioDTO datosEnvio;
    private List<ItemCarritoDTO> items;
    private String metodoPago;

    // Getters y Setters

    public DatosEnvioDTO getDatosEnvio() {
        return datosEnvio;
    }

    public void setDatosEnvio(DatosEnvioDTO datosEnvio) {
        this.datosEnvio = datosEnvio;
    }

    public List<ItemCarritoDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemCarritoDTO> items) {
        this.items = items;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
