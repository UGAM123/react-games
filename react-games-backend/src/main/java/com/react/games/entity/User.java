package com.react.games.entity;

import com.react.games.enums.Status;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class User {
    @Id
    private String nickName;
    private String fullName;
    private Status status;

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public User(String nickName, String fullName, Status status) {
        this.nickName = nickName;
        this.fullName = fullName;
        this.status = status;
    }

    public User() {
    }
}
