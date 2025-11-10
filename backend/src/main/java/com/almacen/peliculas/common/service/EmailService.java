package com.almacen.peliculas.common.service;

import com.almacen.peliculas.pedidos.domain.Pedido;

/**
 * Servicio para el envío de correos electrónicos.
 */
public interface EmailService {

    /**
     * Envía un correo de confirmación de pedido a un usuario.
     *
     * @param pedido El pedido que se ha creado y del cual se enviará la confirmación.
     */
    void enviarEmailConfirmacionPedido(Pedido pedido);

}
