package com.dochoi.ezenpocha.mapper;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dochoi.ezenpocha.vo.*;

@Repository
public interface EzenOrderItemRepository extends JpaRepository<EzenOrderItem, Long> {

    // 특정 테이블(EzenTable 객체)에 속한 모든 주문 내역을 삭제하는 메서드
    // 테이블을 초기화(clear)할 때 사용됩니다.
    // @Transactional 어노테이션이 있는 서비스 계층에서 호출되어야 합니다.
    void deleteByTable(EzenTable table);
    List<EzenOrderItem> findAll();
}

