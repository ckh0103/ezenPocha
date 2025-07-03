package com.dochoi.ezenpocha.websoket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor // -> public StaffCallMessage() {} 와 동일한 역할
@ToString          // -> System.out.println(message) 시 객체 내용을 예쁘게 출력
public class StaffCallMessage {
    private String tableNumber;
    private String message;
}