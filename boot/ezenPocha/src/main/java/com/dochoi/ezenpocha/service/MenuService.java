package com.dochoi.ezenpocha.service;

import com.dochoi.ezenpocha.vo.Menu;
import com.dochoi.ezenpocha.mapper.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    // 모든 메뉴 조회
    public List<Menu> findAllMenus() {
        return menuRepository.findAll();
    }

    // ID로 메뉴 조회
    public Optional<Menu> findMenuById(Long id) {
        return menuRepository.findById(id);
    }

    // 메뉴 저장 (등록 또는 수정)
    public Menu saveMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    // 메뉴 삭제
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
}