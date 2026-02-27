package com.example.taskmanager.repository;





import org.springframework.data.jpa.repository.JpaRepository;

import com.example.taskmanager.entity.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserEmail(String userEmail);
}