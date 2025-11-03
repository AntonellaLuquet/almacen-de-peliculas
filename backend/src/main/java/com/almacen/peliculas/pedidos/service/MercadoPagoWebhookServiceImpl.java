package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.pedidos.domain.EstadoPedido;
import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.infra.PedidoRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class MercadoPagoWebhookServiceImpl implements MercadoPagoWebhookService {

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoWebhookServiceImpl.class);

    @Value("${mercadopago.access-token}")
    private String accessToken;

    private final PedidoRepository pedidoRepository;

    public MercadoPagoWebhookServiceImpl(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    @Transactional
    public void processWebhook(Map<String, Object> payload) {
        logger.info("Procesando webhook de Mercado Pago: {}", payload);

        String type = (String) payload.get("type");
        if ("payment".equals(type)) {
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            String paymentIdStr = (String) data.get("id");

            if (paymentIdStr == null || paymentIdStr.isEmpty()) {
                logger.warn("No se pudo encontrar el ID del pago en el webhook: {}", payload);
                return;
            }

            try {
                MercadoPagoConfig.setAccessToken(accessToken);
                PaymentClient client = new PaymentClient();
                Payment payment = client.get(Long.parseLong(paymentIdStr));

                if (payment == null) {
                    logger.warn("No se encontró el pago con ID: {}", paymentIdStr);
                    return;
                }

                String externalReference = payment.getExternalReference();
                if (externalReference == null || externalReference.isEmpty()) {
                    logger.warn("El pago {} no tiene una referencia externa.", payment.getId());
                    return;
                }

                Long pedidoId = Long.parseLong(externalReference);
                Pedido pedido = pedidoRepository.findById(pedidoId)
                        .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + pedidoId));

                switch (payment.getStatus()) {
                    case "approved":
                        pedido.setEstado(EstadoPedido.CONFIRMADO);
                        break;
                    case "rejected":
                        pedido.setEstado(EstadoPedido.RECHAZADO);
                        break;
                    case "cancelled":
                        pedido.setEstado(EstadoPedido.CANCELADO);
                        break;
                    default:
                        // Otros estados como "in_process" o "pending" no cambian el estado del pedido
                        break;
                }

                pedido.setTransaccionId(payment.getId().toString());
                pedidoRepository.save(pedido);

                logger.info("Pedido {} actualizado al estado {} basado en el pago {}", pedido.getId(), pedido.getEstado(), payment.getId());

            } catch (MPException | MPApiException e) {
                logger.error("Error al procesar el webhook de Mercado Pago", e);
            }
        }
    }
}
