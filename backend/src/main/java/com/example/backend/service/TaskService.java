package com.example.backend.service;

import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.TaskStatus;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getAllTasks(TaskStatus status, String userEmail);
    TaskResponse getTaskById(Long id, String userEmail);
    TaskResponse createTask(TaskRequest request, String userEmail);
    TaskResponse updateTask(Long id, TaskRequest request, String userEmail);
    void deleteTask(Long id, String userEmail);
}
