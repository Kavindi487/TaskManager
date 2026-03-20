package com.example.backend.dto;

import com.example.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private TaskStatus status;
}
