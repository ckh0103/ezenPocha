package com.dochoi.ezenpocha.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//TableStatusDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableStatusDTO {
    private Long id;
    private String name; // EzenTable의 'name' 필드와 일치
    private String status;
    private GenderCountDTO genderCount;
    private List<OrderItemDTO> items;
    private long totalAmount;
}
