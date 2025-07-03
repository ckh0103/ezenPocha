package com.dochoi.ezenpocha.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.dochoi.ezenpocha.service.MenuService;
import com.dochoi.ezenpocha.vo.Menu;

@RestController
@RequestMapping("/api/menus") // 메뉴 관련 API의 기본 경로
@CrossOrigin(origins = "http://localhost:3000") // React 개발 서버 포트 허용
public class MenuController {

    @Autowired
    private MenuService menuService;

    // 모든 메뉴 조회 (GET /api/menus)
    @GetMapping
    public List<Menu> getAllMenus() {
        return menuService.findAllMenus();
    }

    // 단일 메뉴 조회 (GET /api/menus/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable Long id) {
        return menuService.findMenuById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 새 메뉴 등록 (POST /api/menus)
    @PostMapping
    public ResponseEntity<Menu> createMenu(@RequestBody Menu menu) {
        // 새 메뉴 등록 시 ID는 DB 시퀀스에서 자동 생성되므로 null로 설정
        menu.setMenuId(null);
        Menu savedMenu = menuService.saveMenu(menu);
        return new ResponseEntity<>(savedMenu, HttpStatus.CREATED);
    }

    // 메뉴 수정 (PUT /api/menus/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @RequestBody Menu menuDetails) {
        return menuService.findMenuById(id)
                .map(existingMenu -> {
                    // 기존 메뉴 정보를 업데이트
                    existingMenu.setName(menuDetails.getName());
                    existingMenu.setPrice(menuDetails.getPrice());
                    existingMenu.setCategory(menuDetails.getCategory());
                    existingMenu.setImage(menuDetails.getImage());
                    Menu updatedMenu = menuService.saveMenu(existingMenu);
                    return ResponseEntity.ok(updatedMenu);
                })
                .orElse(ResponseEntity.notFound().build()); // ID에 해당하는 메뉴가 없으면 404
    }

    // 메뉴 삭제 (DELETE /api/menus/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        if (menuService.findMenuById(id).isPresent()) { // 메뉴가 존재하는지 확인
            menuService.deleteMenu(id);
            return ResponseEntity.noContent().build(); // 성공적으로 삭제 시 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // ID에 해당하는 메뉴가 없으면 404
        }
    }
}