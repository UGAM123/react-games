package com.react.games.service;

import com.react.games.entity.User;
import com.react.games.enums.Status;
import com.react.games.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public void saveUser(User user){
        user.setStatus(Status.ONLINE);
        userRepo.save(user);
    }

    public void disconnect(User user){
        var storedUser = userRepo.findById(user.getNickName()).orElse(null);
        if(storedUser!= null){
            storedUser.setStatus(Status.OFFLINE);
            userRepo.save(user);
        }

    }

    public List<User> findConnectedUsers(){

        return userRepo.findAll();
    }
}
