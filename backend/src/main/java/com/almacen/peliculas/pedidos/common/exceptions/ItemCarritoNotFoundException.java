package com.almacen.peliculas.pedidos.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ItemCarritoNotFoundException extends RuntimeException {

    public ItemCarritoNotFoundException(String message) {
        super(message);
    }
}
