package com.example.restservice.test.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@Table(name = "test")
@NoArgsConstructor
@AllArgsConstructor
public class TestModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer testIndex;
    private Integer testLevel;
    private Integer testMaxDays;
}
