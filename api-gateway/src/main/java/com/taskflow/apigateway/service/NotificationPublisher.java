package com.taskflow.apigateway.service;

import com.taskflow.apigateway.config.MessagingConfig;
import com.taskflow.apigateway.dto.TaskPayload;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationPublisher {

    private final RabbitTemplate rabbitTemplate;
    private final TopicExchange exchange;

    public NotificationPublisher(RabbitTemplate rabbitTemplate, TopicExchange exchange) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchange = exchange;
    }

    public void sendTaskCreated(TaskPayload task) {
        rabbitTemplate.convertAndSend(
                exchange.getName(),
                MessagingConfig.ROUTING_KEY_TASK_CREATED,
                task
        );
    }
}
