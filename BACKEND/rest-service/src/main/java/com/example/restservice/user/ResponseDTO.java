package com.example.restservice.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ResponseDTO<T> {
    private String error;
    private List<T> data;
}

// T가 여러개 담길수 있다는걸까