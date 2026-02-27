/**
 * Task Manager - Complete CRUD Application
 * Handles: Create, Read, Update (Toggle & Edit), Delete
 */

const API_URL = '/api/tasks';
let tasks = [];

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

async function checkAuth() {
    try {
        const response = await fetch(API_URL);
        
        if (response.ok) {
            // User is authenticated - load tasks
            tasks = await response.json();
            showAuthenticatedUI();
            renderTasks();
            updateStats();
        } else {
            // User not authenticated - show login
            showLoginUI();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showLoginUI();
    }
}

// ==========================================
// UI FUNCTIONS
// ==========================================

function showAuthenticatedUI() {
    document.getElementById('user-info').innerHTML = 
        '<a href="/logout" class="btn btn-logout">Logout</a>';
    document.getElementById('task-form').style.display = 'flex';
    document.getElementById('taskStats').style.display = 'flex';
}

function showLoginUI() {
    document.getElementById('user-info').innerHTML = 
        '<a href="/oauth2/authorization/google" class="btn btn-login">Login with Google</a>';
    document.getElementById('task-form').style.display = 'none';
    document.getElementById('taskStats').style.display = 'none';
    
    document.getElementById('taskList').innerHTML = 
        '<div class="login-prompt">' +
            '<div class="login-prompt-icon">🔐</div>' +
            '<p style="color: #718096; margin-bottom: 15px;">Please login to manage tasks</p>' +
            '<a href="/oauth2/authorization/google" class="btn btn-primary">Login with Google</a>' +
        '</div>';
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    if (tasks.length === 0) {
        taskList.innerHTML = 
            '<div class="empty-state">' +
                '<div class="empty-state-icon">📝</div>' +
                '<p>No tasks yet</p>' +
                '<p style="font-size: 0.85rem; color: #a0aec0;">Add a task above to get started!</p>' +
            '</div>';
        return;
    }
    
    taskList.innerHTML = tasks.map(task => 
        '<li class="' + (task.completed ? 'completed' : '') + '" data-id="' + task.id + '">' +
            '<div class="task-checkbox ' + (task.completed ? 'checked' : '') + '" onclick="toggleTask(' + task.id + ')"></div>' +
            '<span class="task-content" onclick="toggleTask(' + task.id + ')">' + escapeHtml(task.title) + '</span>' +
            '<div class="task-actions">' +
                '<button class="btn btn-edit" onclick="editTask(' + task.id + ')" title="Edit">✏️</button>' +
                '<button class="btn btn-danger" onclick="deleteTask(' + task.id + ')" title="Delete">🗑️</button>' +
            '</div>' +
        '</li>'
    ).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    const statsDiv = document.getElementById('taskStats');
    
    if (total > 0) {
        statsDiv.innerHTML = 
            '<span>Total: <strong>' + total + '</strong></span>' +
            '<span>Completed: <strong>' + completed + '</strong></span>' +
            '<span>Pending: <strong>' + pending + '</strong></span>';
    } else {
        statsDiv.innerHTML = '';
    }
}

// ==========================================
// CRUD OPERATIONS
// ==========================================

// CREATE - Add new task
async function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();
    
    if (!title) {
        showNotification('Please enter a task title', 'warning');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                completed: false 
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
        
        const newTask = await response.json();
        tasks.unshift(newTask); // Add to beginning
        renderTasks();
        updateStats();
        input.value = '';
        showNotification('Task added successfully!', 'success');
        
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Failed to add task', 'error');
    }
}

// READ - Reload all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }
        
        tasks = await response.json();
        renderTasks();
        updateStats();
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Failed to load tasks', 'error');
    }
}

// UPDATE - Toggle task completion
async function toggleTask(taskId) {
    try {
        const response = await fetch(API_URL + '/' + taskId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        
        const updatedTask = await response.json();
        
        // Update local array
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
        }
        
        renderTasks();
        updateStats();
        
    } catch (error) {
        console.error('Error toggling task:', error);
        showNotification('Failed to update task', 'error');
    }
}

// UPDATE - Open edit modal
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        showNotification('Task not found', 'error');
        return;
    }
    
    // Set values in modal
    document.getElementById('editTaskId').value = taskId;
    document.getElementById('editTaskInput').value = task.title;
    
    // Show modal
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    // Focus input
    setTimeout(() => {
        document.getElementById('editTaskInput').focus();
    }, 100);
}

// UPDATE - Save edited task
async function saveEditedTask() {
    const taskId = parseInt(document.getElementById('editTaskId').value);
    const newTitle = document.getElementById('editTaskInput').value.trim();
    
    if (!newTitle) {
        showNotification('Task title cannot be empty', 'warning');
        return;
    }
    
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        showNotification('Task not found', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/' + taskId + '/edit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: newTitle, 
                completed: task.completed 
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        
        const updatedTask = await response.json();
        
        // Update local array
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
        }
        
        closeEditModal();
        renderTasks();
        showNotification('Task updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Failed to update task', 'error');
    }
}

// DELETE - Remove task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/' + taskId, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        // Remove from local array
        tasks = tasks.filter(t => t.id !== taskId);
        
        renderTasks();
        updateStats();
        showNotification('Task deleted successfully!', 'success');
        
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// ==========================================
// MODAL FUNCTIONS
// ==========================================

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.getElementById('editTaskInput').value = '';
    document.getElementById('editTaskId').value = '';
}

// Close modal on outside click
document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditModal();
    }
});

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
        notification.remove();
    }, 3000);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Add task on Enter key
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Save edited task on Enter key in modal
document.getElementById('editTaskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        saveEditedTask();
    }
});