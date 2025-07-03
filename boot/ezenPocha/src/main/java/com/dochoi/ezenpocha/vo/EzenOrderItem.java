package com.dochoi.ezenpocha.vo;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@Table(name = "EZEN_ORDER_ITEMS")
public class EzenOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_item_seq_generator")
    @SequenceGenerator(
        name = "order_item_seq_generator",
        sequenceName = "ORDER_ITEM_SEQ", // 위에서 생성한 시퀀스 이름과 일치
        allocationSize = 1 // 시퀀스 할당 크기 (기본값 50, 충돌 방지를 위해 1로 설정)
    )
    @Column(name = "ORDER_ITEM_ID")
    private Long orderItemId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TABLE_ID", nullable = false)
    private EzenTable table;

    @Column(name = "MENU_NAME", nullable = false)
    private String menuName;

    @Column(name = "QUANTITY", nullable = false)
    private int quantity;

    @Column(name = "PRICE", nullable = false)
    private long price;
}