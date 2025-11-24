package com.taskflow.apigateway.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessagingConfig {

    public static final String NOTIFICATION_EXCHANGE = "task.notifications.exchange";
    public static final String ROUTING_KEY_TASK_CREATED = "task.created";

    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }
}
