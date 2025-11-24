package com.taskflow.notificationworker.service;

import com.taskflow.notificationworker.config.MessagingConfig;
import com.taskflow.notificationworker.model.TaskMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    private static final Logger logger = LoggerFactory.getLogger(NotificationListener.class);

    @RabbitListener(queues = MessagingConfig.NOTIFICATION_QUEUE, containerFactory = "rabbitListenerContainerFactory")
    public void handleTaskCreated(TaskMessage message) {
        logger.info("NotificationWorker - recebida tarefa '{}' (id={}) para usuário '{}'. Enviando notificação...",
                message.getTitle(), message.getId(), message.getUserId());
        try {
            Thread.sleep(1000L); // simula processamento pesado
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("Notificação enviada para tarefa '{}' (id={})", message.getTitle(), message.getId());
    }
}
