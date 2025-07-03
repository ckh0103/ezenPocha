package com.dochoi.ezenpocha.vo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "EZEN_MENUS") // Oracle 테이블 이름과 일치
@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 자동 생성
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "menu_seq_generator")
    @SequenceGenerator(
        name = "menu_seq_generator",
        sequenceName = "MENU_SEQ", // Oracle 시퀀스 이름과 일치
        allocationSize = 1 // 시퀀스 할당 크기
    )
    @Column(name = "MENU_ID")
    private Long menuId; // DB 컬럼명 MENU_ID와 매핑

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "PRICE", nullable = false)
    private Integer price;

    @Column(name = "CATEGORY", nullable = false)
    private String category;

    @Column(name = "IMAGE")
    private String image;

    // Lombok @Data 어노테이션이 Getter, Setter 등을 자동으로 생성합니다.
    // 만약 Lombok을 사용하지 않는다면 직접 Getter/Setter를 추가해야 합니다.
}