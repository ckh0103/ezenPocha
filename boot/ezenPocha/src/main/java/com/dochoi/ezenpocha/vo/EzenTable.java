package com.dochoi.ezenpocha.vo;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "EZEN_TABLES")
public class EzenTable {

    @Id
    @Column(name = "TABLE_ID")
    private Long id;

    @Column(name = "TABLE_NAME", nullable = false, unique = true)
    private String name; // 프론트엔드의 tableNumber에 해당

    @Column(name = "STATUS", nullable = false)
    private String status = "EMPTY";

    @Column(name = "MALE_COUNT")
    private int maleCount = 0;

    @Column(name = "FEMALE_COUNT")
    private int femaleCount = 0;

    @Column(name = "TOTAL_AMOUNT")
    private long totalAmount = 0;

    @JsonManagedReference
    @OneToMany(mappedBy = "table", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EzenOrderItem> orderItems = new ArrayList<>();

    // 참고: EzenOrderItem.java도 올바르게 정의되어 있어야 합니다.
    // EzenTable의 Getter/Setter 등은 Lombok @Data가 생성합니다.

    // 프론트엔드 tableData.genderCount 와 맞추기 위한 Getter (필요시)
    // Spring Boot 3.x의 Jackson은 필드명과 Getter/Setter를 잘 매핑하지만
    // 만약 프론트에서 maleCount/femaleCount 대신 male/female을 기대한다면 추가
    public GenderCount getGenderCount() {
        return new GenderCount(this.maleCount, this.femaleCount);
    }

    @Embeddable
    @Data
    public static class GenderCount {
        private Integer male;
        private Integer female;

        public GenderCount(Integer male, Integer female) {
            this.male = male;
            this.female = female;
        }
    }
}