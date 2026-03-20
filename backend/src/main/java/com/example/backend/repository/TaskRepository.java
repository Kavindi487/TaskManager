package com.example.backend.repository;

import com.example.backend.entity.AppUser;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByOwnerOrderByCreatedAtDesc(AppUser owner);
    List<Task> findByOwnerAndStatusOrderByCreatedAtDesc(AppUser owner, TaskStatus status);
    Optional<Task> findByIdAndOwner(Long id, AppUser owner);
}
