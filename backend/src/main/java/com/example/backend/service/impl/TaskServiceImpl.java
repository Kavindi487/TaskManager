package com.example.backend.service.impl;

import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.AppUser;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public List<TaskResponse> getAllTasks(TaskStatus status, String userEmail) {
        AppUser owner = findUserByEmail(userEmail);
        List<Task> tasks = (status == null)
                ? taskRepository.findByOwnerOrderByCreatedAtDesc(owner)
                : taskRepository.findByOwnerAndStatusOrderByCreatedAtDesc(owner, status);

        return tasks.stream().map(this::mapToResponse).toList();
    }

    @Override
    public TaskResponse getTaskById(Long id, String userEmail) {
        return mapToResponse(findTaskByIdAndOwner(id, userEmail));
    }

    @Override
    public TaskResponse createTask(TaskRequest request, String userEmail) {
        AppUser owner = findUserByEmail(userEmail);

        Task task = Task.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO)
                .owner(owner)
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request, String userEmail) {
        Task task = findTaskByIdAndOwner(id, userEmail);
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO);
        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id, String userEmail) {
        taskRepository.delete(findTaskByIdAndOwner(id, userEmail));
    }

    private AppUser findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Task findTaskByIdAndOwner(Long id, String email) {
        AppUser owner = findUserByEmail(email);
        return taskRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private TaskResponse mapToResponse(Task task) {
        // Safely handle legacy rows where updatedAt may be null after migration
        LocalDateTime updatedAt = task.getUpdatedAt() != null
                ? task.getUpdatedAt()
                : (task.getCreatedAt() != null ? task.getCreatedAt() : LocalDateTime.now());

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(updatedAt)
                .build();
    }
}
