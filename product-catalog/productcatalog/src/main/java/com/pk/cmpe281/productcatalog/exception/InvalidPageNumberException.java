package com.pk.cmpe281.productcatalog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class InvalidPageNumberException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;
}
