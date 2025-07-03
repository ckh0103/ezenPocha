package com.dochoi.ezenpocha.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class OrderItemDTO {
 private int no; // 순번
 private String name;
 private int quantity;
 private long price;
}
