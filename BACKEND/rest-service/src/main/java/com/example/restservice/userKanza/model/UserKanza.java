package com.example.restservice.userKanza.model;

import java.time.LocalDateTime;

import com.example.restservice.kanza.model.KanzaModel;
import com.example.restservice.user.model.UserModel;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_kanza")
public class UserKanza {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userKanzaIndex;

    @JoinColumn(name = "user_index")
    @ManyToOne
    private UserModel userIndex;

    @JoinColumn(name = "kanza_index")
    @ManyToOne
    private KanzaModel kanzaIndex;

    private Integer userKanzaScore;

    @JsonIgnore
    private LocalDateTime userKanzaUpdatedAt;

    @PrePersist
    protected void onCreate() {
        if (userKanzaUpdatedAt == null) {
            userKanzaUpdatedAt = LocalDateTime.now();
        }
        if (userKanzaScore == null) {
            userKanzaScore = 0;
        }
    }
}
