package com.taskflow.apigateway.service;

import com.taskflow.apigateway.dto.TaskPayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class TaskServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public TaskServiceClient(RestTemplate restTemplate,
                             @Value("${task-service.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public TaskPayload createTask(TaskPayload payload) {
        return restTemplate.postForObject(baseUrl + "/tasks", payload, TaskPayload.class);
    }

    public List<TaskPayload> listTasks() {
        TaskPayload[] response = restTemplate.getForObject(baseUrl + "/tasks", TaskPayload[].class);
        if (response == null) {
            return List.of();
        }
        return Arrays.asList(response);
    }

    public TaskPayload completeTask(Long id) {
        return restTemplate.postForObject(baseUrl + "/tasks/" + id + "/complete", null, TaskPayload.class);
    }

    public void deleteTask(Long id) {
        restTemplate.delete(baseUrl + "/tasks/" + id);
    }
}
