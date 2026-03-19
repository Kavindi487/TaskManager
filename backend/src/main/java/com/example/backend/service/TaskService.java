package com.example.backend.service;


import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.TaskStatus;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getAllTasks(TaskStatus status);
    TaskResponse getTaskById(Long id);
    TaskResponse createTask(TaskRequest request);
    TaskResponse updateTask(Long id, TaskRequest request);
    void deleteTask(Long id);
}
