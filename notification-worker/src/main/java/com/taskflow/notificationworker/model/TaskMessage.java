package com.taskflow.notificationworker.model;

public class TaskMessage {

    private Long id;
    private String title;
    private String description;
    private String userId;
    private String dueDate;
    private String reminderAt;
    private boolean completed;

    public TaskMessage() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getReminderAt() {
        return reminderAt;
    }

    public void setReminderAt(String reminderAt) {
        this.reminderAt = reminderAt;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
