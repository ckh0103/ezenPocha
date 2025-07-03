package com.dochoi.ezenpocha.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final PochaWebSocketHandler pochaWebSocketHandler;

    public WebSocketConfig(PochaWebSocketHandler pochaWebSocketHandler) {
        this.pochaWebSocketHandler = pochaWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(pochaWebSocketHandler, "/ws/pocha")
                .setAllowedOriginPatterns("*"); // 모든 오리진 허용 (개발 단계에서만)
    }
}








