package com.taskflow.taskservice.controller;

import com.taskflow.taskservice.model.Task;
import com.taskflow.taskservice.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        return repository.save(task);
    }

    @GetMapping
    public List<Task> list() {
        return repository.findAll();
    }
}
