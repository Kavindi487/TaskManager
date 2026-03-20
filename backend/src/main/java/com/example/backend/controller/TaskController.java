package com.example.backend.controller;

import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.TaskStatus;
import com.example.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getAllTasks(@RequestParam(required = false) TaskStatus status,
                                          Authentication authentication) {
        return taskService.getAllTasks(status, authentication.getName());
    }

    @GetMapping("/{id}")
    public TaskResponse getTaskById(@PathVariable Long id, Authentication authentication) {
        return taskService.getTaskById(id, authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(@Valid @RequestBody TaskRequest request, Authentication authentication) {
        return taskService.createTask(request, authentication.getName());
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(@PathVariable Long id,
                                   @Valid @RequestBody TaskRequest request,
                                   Authentication authentication) {
        return taskService.updateTask(id, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id, Authentication authentication) {
        taskService.deleteTask(id, authentication.getName());
    }
}
