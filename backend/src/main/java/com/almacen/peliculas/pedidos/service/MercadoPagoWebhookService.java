package com.almacen.peliculas.pedidos.service;

import java.util.Map;

/**
 * Servicio para manejar las notificaciones (webhooks) de Mercado Pago.
 */
public interface MercadoPagoWebhookService {

    /**
     * Procesa una notificación de webhook recibida desde Mercado Pago.
     *
     * @param payload El cuerpo de la notificación (webhook).
     */
    void processWebhook(Map<String, Object> payload);
}
