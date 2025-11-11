package com.almacen.peliculas.common.service;

import com.almacen.peliculas.pedidos.domain.Pedido;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Override
    @Async
    public void enviarEmailConfirmacionPedido(Pedido pedido) {
        try {
            String htmlBody = cargarPlantillaHtml("templates/confirmacion-pedido.html");

            // Reemplazar marcadores de posición
            htmlBody = htmlBody.replace("[[nombreUsuario]]", pedido.getUsuario().getNombre());
            htmlBody = htmlBody.replace("[[idPedido]]", pedido.getId().toString());
            htmlBody = htmlBody.replace("[[totalPedido]]", String.format("%.2f", pedido.getTotal()));
            htmlBody = htmlBody.replace("[[metodoPago]]", pedido.getMetodoPago());

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.name());

            helper.setText(htmlBody, true);
            helper.setTo(pedido.getUsuario().getEmail());
            helper.setSubject("Confirmación de tu Pedido #" + pedido.getId());
            helper.setFrom("noreply@almacenpeliculas.com");

            mailSender.send(mimeMessage);
            logger.info("Email de confirmación enviado para el pedido ID: {}", pedido.getId());

        } catch (MessagingException | IOException e) {
            logger.error("Error al enviar email de confirmación para el pedido ID: {}", pedido.getId(), e);
        }
    }

    private String cargarPlantillaHtml(String ruta) throws IOException {
        ClassPathResource resource = new ClassPathResource(ruta);
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
    }
}
