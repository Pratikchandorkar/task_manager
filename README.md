# Task Manager - Spring Boot OAuth2 Application

A complete Task Manager application with Google OAuth2 authentication, featuring full CRUD operations (Create, Read, Update, Delete).

---

## 📋 Table of Contents
- Tech Stack
- Project Structure
- Prerequisites
- Installation
- Google OAuth Setup
- Running the Application
---
## ✨ Features
| Feature | Description |
|------------|---------|
| 🔐 **Google OAuth2 Login | Secure authentication via Google account |
| ➕ **Create Tasks | Add new tasks with title |
| 📖 **Read Tasks | View all tasks for logged-in user |
| ✏️ **Edit Tasks | Update task titles |
| ✅ **Toggle Completion | Mark tasks as complete/incomplete |
| 🗑️ **Delete Tasks | Remove tasks with confirmation |
| 📊 **Task Statistics | View total, completed, and pending counts |
| 📱 **Responsive Design | Works on desktop and mobile|

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Java 17+ | Backend programming language |
| Spring Boot 3.x | Backend framework |
| Spring Security OAuth2 | Authentication |
| Spring Data JPA | Database operations |
| H2 Database | In-memory database |
| HTML5 / CSS3 / JavaScript (ES6+) | Frontend structure, styling, and logic |
| Maven | Build tool |

---

## 📁 Project Structure
```
task-manager/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── taskmanager/
│       │               ├── TaskManagerApplication.java
│       │               ├── Task.java
│       │               ├── TaskRepository.java
│       │               ├── TaskController.java
│       │               └── SecurityConfig.java
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── index.html
│               ├── style.css
│               └── app.js
├── pom.xml
└── README.md
```
---

## 📋 Prerequisites

Before you begin, ensure you have:

- Java Development Kit (JDK) 17 or higher  
- Apache Maven 3.6+  
- Google Account (for OAuth2)  
- Modern web browser (Chrome, Firefox, Edge)  

---

## 🚀 Installation

1. **Clone or Create Project**  

   Create a Spring Boot project using [Spring Initializr](https://start.spring.io):

   - Project: Maven  
   - Language: Java  
   - Spring Boot: 3.x  
   - Dependencies: Spring Web, Spring Data JPA, H2 Database, OAuth2 Client, Lombok (optional)  

2. **Download Dependencies**

```bash
mvn clean install
```
# 🔐 Google OAuth Setup
## Step 1: Create Google Cloud Project
 1. Go to Google Cloud Console
 2. Click "Select a project" → "New Project"
 3. Enter project name: TaskManager
 4. Click "Create"

## Step 2: Configure OAuth Consent Screen
 1. Go to APIs & Services → OAuth consent screen
 2. Select "External" user type
 3. Fill in required fields:
* App name: Task Manager
* User support email: Your email
* Email addresses: Add your email
4. Click "Save and Continue" (skip optional scopes)
## Step 3: Create OAuth Credentials
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: Task Manager Web
5. Authorized redirect URIs:

```bush
http://localhost:8080/login/oauth2/code/google
```
6. Click "Create"
7. Copy Client ID and Client Secret
## Step 4: Update Configuration
Edit src/main/resources/application.properties:
```bush
properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update

# OAuth2 Google Configuration
# ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID_HERE
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET_HERE
spring.security.oauth2.client.registration.google.scope=profile,email

# Static Resources
spring.web.resources.static-locations=classpath:/static/

```
# ▶️ Running the Application
## Option 1: Using Maven
```bash
mvn spring-boot:run
```
## Option 2: Using IDE
1. Open project in IntelliJ IDEA or Eclipse
2. Run TaskManagerApplication class
3. Open browser to `http://localhost:8080`
---   
# Static Resources

# 📝 Usage Guide
## First Time Setup
1. Start the application
2. Click "Login with Google"
3. Select your Google account
4. Allow permissions
5. Start managing tasks!

# Managing Tasks
|Action | How To |
|------------|---------|
| Add Task | Type in input box → Press Enter or click "Add" |
| Complete Task | Click checkbox or task text |
| Edit Task | Click ✏️ icon → Edit → Click "Save" |
| Delete Task | Click 🗑️ icon → Confirm |
---
# 🔒 Security Notes
* ✅ OAuth2 tokens are managed by Spring Security
* ✅ User data is isolated per email address
* ✅ CSRF protection disabled for API (REST)
* ⚠️ Change spring.security.oauth2.client.registration.google.client-secret in production
* ⚠️ Use HTTPS in production
