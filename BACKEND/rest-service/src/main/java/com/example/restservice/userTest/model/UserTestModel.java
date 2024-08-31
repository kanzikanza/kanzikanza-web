package com.example.restservice.userTest.model;

import com.example.restservice.test.model.TestModel;
import com.example.restservice.user.model.UserModel;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_test")
public class UserTestModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userTestIndex;
    @JoinColumn(name = "user_index")
    @ManyToOne
    private UserModel userModel;
    @JoinColumn(name = "test_index")
    @ManyToOne
    private TestModel testModel;
    @Column(nullable = true)
    private Integer userTestProgress;
}
