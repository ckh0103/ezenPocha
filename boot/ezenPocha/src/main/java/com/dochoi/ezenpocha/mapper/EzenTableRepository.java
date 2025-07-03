package com.dochoi.ezenpocha.mapper;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dochoi.ezenpocha.vo.EzenTable;

import java.util.List;

@Repository // 이 인터페이스가 Spring의 데이터 접근 계층(Repository) Bean임을 선언
public interface EzenTableRepository extends JpaRepository<EzenTable, Long> {
    // JpaRepository<[관리할 Entity 클래스], [Entity의 ID 타입]>

    // 이 인터페이스는 비워두어도 save(), findById(), findAll() 등 기본적인 CRUD 메서드를 모두 상속받아 사용할 수 있습니다.

    // 필요에 따라 아래와 같이 사용자 정의 쿼리 메서드를 추가할 수 있습니다.
    // Spring Data JPA가 메서드 이름을 분석하여 자동으로 SQL 쿼리를 생성해 줍니다.
    // "ID를 기준으로 오름차순으로 정렬하여 모든 데이터를 찾아라"
    List<EzenTable> findAllByOrderByIdAsc();

}
