package com.gameportfolio.backend.exception;

public class AuthenticationFailedException
        extends RuntimeException {

    public AuthenticationFailedException(String message) {
        super(message);
    }
}
