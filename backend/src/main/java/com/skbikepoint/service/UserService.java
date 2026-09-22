package com.skbikepoint.service;

import com.skbikepoint.dto.auth.UserDto;
import com.skbikepoint.entity.Role;
import com.skbikepoint.entity.User;
import com.skbikepoint.exception.ResourceNotFoundException;
import com.skbikepoint.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllCustomers() {
        return userRepository.findByRole(Role.ROLE_CUSTOMER).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getCustomerCount() {
        return userRepository.countByRole(Role.ROLE_CUSTOMER);
    }
}
