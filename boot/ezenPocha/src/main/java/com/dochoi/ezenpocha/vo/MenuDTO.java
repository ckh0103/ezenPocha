package com.dochoi.ezenpocha.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class MenuDTO {
    private Long id;
    private String name;
    private long price;
    private String category;
    private String image;
}