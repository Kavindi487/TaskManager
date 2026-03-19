package com.example.backend.service.impl;


import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TaskRepository;
import com.example.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public List<TaskResponse> getAllTasks(TaskStatus status) {
        List<Task> tasks = (status == null)
                ? taskRepository.findAll()
                : taskRepository.findByStatus(status);

        return tasks.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = findTaskById(id);
        return mapToResponse(task);
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskById(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO);

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
