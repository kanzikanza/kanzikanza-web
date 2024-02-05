package com.example.restservice.socket;

public record message(String type, String sender, Object data) {
}
