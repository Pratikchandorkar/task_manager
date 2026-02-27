package com.example.taskmanager.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.repository.TaskRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // CREATE - Add new task
    @PostMapping
    public Task createTask(@RequestBody Task task, 
                          @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }
        String email = principal.getAttribute("email");
        task.setUserEmail(email);
        task.setCompleted(false);
        return taskRepository.save(task);
    }

    // READ - Get all tasks for user
    @GetMapping
    public List<Task> getTasks(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }
        String email = principal.getAttribute("email");
        return taskRepository.findByUserEmail(email);
    }

    // UPDATE - Toggle completion
    @PutMapping("/{id}")
    public Task toggleTask(@PathVariable Long id, 
                          @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }
        String email = principal.getAttribute("email");
        Task task = taskRepository.findById(id).orElse(null);
        
        if (task != null && email.equals(task.getUserEmail())) {
            task.setCompleted(!task.isCompleted());
            return taskRepository.save(task);
        }
        return task;
    }

    // UPDATE - Edit task title
    @PutMapping("/{id}/edit")
    public Task updateTask(@PathVariable Long id, 
                          @RequestBody Task taskUpdate, 
                          @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }
        String email = principal.getAttribute("email");
        Task task = taskRepository.findById(id).orElse(null);
        
        if (task != null && email.equals(task.getUserEmail())) {
            task.setTitle(taskUpdate.getTitle());
            return taskRepository.save(task);
        }
        return task;
    }

    // DELETE - Remove task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, 
                                          @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String email = principal.getAttribute("email");
        Task task = taskRepository.findById(id).orElse(null);
        
        if (task != null && email.equals(task.getUserEmail())) {
            taskRepository.delete(task);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build();
    }
}