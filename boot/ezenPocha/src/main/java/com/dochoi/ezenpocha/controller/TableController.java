package com.dochoi.ezenpocha.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dochoi.ezenpocha.mapper.EzenTableRepository;
import com.dochoi.ezenpocha.vo.EzenTable;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:3000")
public class TableController {

    @Autowired
    private EzenTableRepository tableRepository;

    @GetMapping("/{id}")
    public ResponseEntity<EzenTable> getTableById(@PathVariable("id") Long id) {
        return tableRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}