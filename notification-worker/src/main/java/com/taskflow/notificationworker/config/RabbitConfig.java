package com.taskflow.notificationworker.config;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean
    public MessageConverter messageConverter() {
        // Converte o JSON recebido do RabbitMQ em TaskMessage
        return new Jackson2JsonMessageConverter();
    }
}
