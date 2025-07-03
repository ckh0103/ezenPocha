package com.dochoi.ezenpocha.mapper;

import com.dochoi.ezenpocha.vo.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    // Spring Data JPA가 기본 CRUD 메서드를 자동으로 제공합니다.
}