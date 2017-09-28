package com.pk.cmpe281.productcatalog.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {
	
	 @RequestMapping("/welcome")
	 @ResponseBody
	 public String displayWelomeMessage(){
		 return "Welcom, User..!!";
	 }
	 
}
