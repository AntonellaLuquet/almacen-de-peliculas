package com.almacen.peliculas.pedidos.api;

import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.domain.dto.CheckoutDTO;
import com.almacen.peliculas.pedidos.service.MercadoPagoWebhookService;
import com.almacen.peliculas.pedidos.service.PedidoService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments/mercadopago")
public class MercadoPagoController {

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoController.class);
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${app.base-url:http://localhost:8081}")
    private String appBaseUrl;

    private final PedidoService pedidoService;
    private final MercadoPagoWebhookService webhookService;

    public MercadoPagoController(PedidoService pedidoService, MercadoPagoWebhookService webhookService) {
        this.pedidoService = pedidoService;
        this.webhookService = webhookService;
    }

    @PostMapping("/create-preference")
    public ResponseEntity<?> createPreference(@RequestBody CheckoutDTO checkoutDTO) {
        logger.info("Recibida solicitud para crear preferencia de pago para el comprador: {}", checkoutDTO.getDatosEnvio().getEmail());

        try {
            if (accessToken == null || accessToken.trim().isEmpty() || !accessToken.startsWith("APP_USR-")) {
                logger.error("El Access Token de Mercado Pago no está configurado correctamente o es inválido.");
                return new ResponseEntity<>("Error de configuración del servidor: Access Token inválido.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            MercadoPagoConfig.setAccessToken(accessToken);

            Pedido pedido = pedidoService.crearPedidoDesdeCheckout(checkoutDTO, "MERCADOPAGO");

            List<PreferenceItemRequest> preferenceItems = new ArrayList<>();
            checkoutDTO.getItems().forEach(item -> {
                if (item.getPrecioUnitario() == null || item.getPrecioUnitario().doubleValue() <= 0) {
                    throw new IllegalArgumentException("El item '" + item.getNombrePelicula() + "' tiene un precio inválido.");
                }
                preferenceItems.add(
                        PreferenceItemRequest.builder()
                                .title(item.getNombrePelicula())
                                .quantity(item.getCantidad())
                                .unitPrice(item.getPrecioUnitario())
                                .build()
                );
            });

            PreferencePayerRequest payer = PreferencePayerRequest.builder()
                    .name(checkoutDTO.getDatosEnvio().getNombre())
                    .surname(checkoutDTO.getDatosEnvio().getApellidos())
                    .email(checkoutDTO.getDatosEnvio().getEmail())
                    .build();

            String notificationUrl = appBaseUrl + "/api/payments/mercadopago/webhook";
            logger.info("URL de notificación configurada: {}", notificationUrl);

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(preferenceItems)
                    .payer(payer)
                    .notificationUrl(notificationUrl)
                    .externalReference(pedido.getId().toString())
                    .backUrls(
                            PreferenceBackUrlsRequest.builder()
                                    .success("http://localhost:3000/checkout/success")
                                    .failure("http://localhost:3000/checkout/failure")
                                    .pending("http://localhost:3000/checkout/pending")
                                    .build()
                    )
                    .autoReturn("approved")
                    .build();

            logger.info("Enviando la siguiente solicitud a Mercado Pago: \n{}", gson.toJson(preferenceRequest));

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return ResponseEntity.ok(Map.of("init_point", preference.getInitPoint()));

        } catch (IllegalArgumentException e) {
            logger.error("Error en los datos de la solicitud: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (MPApiException apiException) {
            logger.error("Error de la API de Mercado Pago: {}", apiException.getApiResponse().getContent(), apiException);
            return new ResponseEntity<>(apiException.getApiResponse().getContent(), HttpStatus.valueOf(apiException.getApiResponse().getStatusCode()));
        } catch (MPException exception) {
            logger.error("Error en el SDK de Mercado Pago: {}", exception.getMessage(), exception);
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> receiveWebhook(@RequestBody Map<String, Object> payload) {
        webhookService.processWebhook(payload);
        return ResponseEntity.ok().build();
    }
}
