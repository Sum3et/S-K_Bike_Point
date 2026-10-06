package com.skbikepoint.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success = true;
    private String message;
    private T data;
    private String errorCode;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, T data, String errorCode, LocalDateTime timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> res = new ApiResponse<>();
        res.setSuccess(true);
        res.setMessage(message);
        res.setData(data);
        res.setTimestamp(LocalDateTime.now());
        return res;
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Operation successful");
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        ApiResponse<T> res = new ApiResponse<>();
        res.setSuccess(false);
        res.setMessage(message);
        res.setErrorCode(errorCode);
        res.setTimestamp(LocalDateTime.now());
        return res;
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(message, "INTERNAL_ERROR");
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
