package com.taskflow.apigateway.config;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean
    public MessageConverter messageConverter() {
        // Converte qualquer POJO em JSON ao enviar para o RabbitMQ
        return new Jackson2JsonMessageConverter();
    }
}
