package com.dochoi.ezenpocha.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import com.dochoi.ezenpocha.mapper.*;
import com.dochoi.ezenpocha.vo.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TableService {

    private final EzenTableRepository tableRepository;
    private final EzenOrderItemRepository orderItemRepository;
    private final ObjectMapper objectMapper;

    public TableService(EzenTableRepository tableRepository, EzenOrderItemRepository orderItemRepository, ObjectMapper objectMapper) {
        this.tableRepository = tableRepository;
        this.orderItemRepository = orderItemRepository;
        this.objectMapper = objectMapper;
    }

    public List<TableStatusDTO> getAllTableStatus() {
        List<EzenTable> tables = tableRepository.findAllByOrderByIdAsc();
        List<EzenOrderItem> allOrderItems = orderItemRepository.findAll();

        Map<Long, List<EzenOrderItem>> orderItemsByTableId = allOrderItems.stream()
                .collect(Collectors.groupingBy(item -> item.getTable().getId()));

        return tables.stream().map(table -> {
            List<EzenOrderItem> itemsForTable = orderItemsByTableId.getOrDefault(table.getId(), new ArrayList<>());
            List<OrderItemDTO> itemDTOs = new ArrayList<>();
            for (int i = 0; i < itemsForTable.size(); i++) {
                EzenOrderItem item = itemsForTable.get(i);
                itemDTOs.add(new OrderItemDTO(
                        i + 1,
                        item.getMenuName(),
                        item.getQuantity(),
                        item.getPrice()
                ));
            }

            return new TableStatusDTO(
                    table.getId(),
                    table.getName(),
                    table.getStatus(),
                    new GenderCountDTO(table.getMaleCount(), table.getFemaleCount()),
                    itemDTOs,
                    table.getTotalAmount()
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public void enterTable(Map<String, Object> messageMap) {
        Map<String, Object> payload = (Map<String, Object>) messageMap.get("payload");
        Long tableId = ((Number) payload.get("tableId")).longValue(); // Long으로 정확히 변환
        int maleCount = (int) payload.get("male");
        int femaleCount = (int) payload.get("female");

        tableRepository.findById(tableId).ifPresent(table -> {
            table.setMaleCount(maleCount);
            table.setFemaleCount(femaleCount);
            table.setStatus("OCCUPIED");
            tableRepository.save(table);
        });
    }

    @Transactional
    public void placeOrder(Map<String, Object> messageMap) {
        Map<String, Object> payload = (Map<String, Object>) messageMap.get("payload");
        Long tableId = ((Number) payload.get("tableId")).longValue(); // Long으로 정확히 변환
        long totalAmount = ((Number) payload.get("totalAmount")).longValue(); // Long으로 정확히 변환

        List<OrderItemDTO> orderedItems = objectMapper.convertValue(
                payload.get("items"),
                new TypeReference<List<OrderItemDTO>>() {}
        );

        tableRepository.findById(tableId).ifPresent(table -> {
            // CascadeType.ALL과 orphanRemoval = true로 인해
            // table.getOrderItems().clear() 만으로도 DB에서 기존 아이템들이 삭제됩니다.
            table.getOrderItems().clear(); // 기존 주문 아이템 리스트 초기화 (DB에서도 삭제)

            for (OrderItemDTO itemDTO : orderedItems) {
                EzenOrderItem newOrderItem = new EzenOrderItem();
                newOrderItem.setTable(table); // 관계 설정
                newOrderItem.setMenuName(itemDTO.getName());
                newOrderItem.setQuantity(itemDTO.getQuantity());
                newOrderItem.setPrice(itemDTO.getPrice());
                // orderItemRepository.save(newOrderItem); // CascadeType.ALL 때문에 EzenTable을 저장하면 자동으로 저장됨
                table.getOrderItems().add(newOrderItem); // 새 주문 아이템 추가
            }

            table.setTotalAmount(totalAmount);
            table.setStatus("주문 완료");
            tableRepository.save(table); // 부모 엔티티를 저장하여 연관된 자식 엔티티도 저장
        });
    }

    @Transactional
    public void clearTable(Map<String, Object> messageMap) {
        Map<String, Object> payload = (Map<String, Object>) messageMap.get("payload");
        Long tableId = ((Number) payload.get("tableId")).longValue();

        tableRepository.findById(tableId).ifPresent(table -> {
            table.getOrderItems().clear(); // CascadeType.ALL, orphanRemoval = true로 인해 DB에서도 삭제

            table.setStatus("EMPTY");
            table.setMaleCount(0);
            table.setFemaleCount(0);
            table.setTotalAmount(0);
            tableRepository.save(table);
        });
    }

    public Optional<EzenTable> findTableById(Long id) {
        return tableRepository.findById(id);
    }
}