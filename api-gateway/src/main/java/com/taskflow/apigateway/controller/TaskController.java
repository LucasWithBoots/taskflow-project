package com.taskflow.apigateway.controller;

import com.taskflow.apigateway.dto.TaskPayload;
import com.taskflow.apigateway.service.NotificationPublisher;
import com.taskflow.apigateway.service.TaskServiceClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskServiceClient taskServiceClient;
    private final NotificationPublisher notificationPublisher;

    public TaskController(TaskServiceClient taskServiceClient,
                          NotificationPublisher notificationPublisher) {
        this.taskServiceClient = taskServiceClient;
        this.notificationPublisher = notificationPublisher;
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskPayload> createTask(@RequestBody TaskPayload payload) {
        TaskPayload created = taskServiceClient.createTask(payload);
        notificationPublisher.sendTaskCreated(created);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/tasks")
    public List<TaskPayload> listTasks() {
        return taskServiceClient.listTasks();
    }
}
