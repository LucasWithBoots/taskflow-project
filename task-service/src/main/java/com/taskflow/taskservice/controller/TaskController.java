package com.taskflow.taskservice.controller;

import com.taskflow.taskservice.model.Task;
import com.taskflow.taskservice.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    @PostMapping("/{id}/complete")
    public Task complete(@PathVariable Long id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        task.setCompleted(true);
        return repository.save(task);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        repository.deleteById(id);
    }
}
