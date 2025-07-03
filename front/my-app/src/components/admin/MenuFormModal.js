// --- START OF FILE components/admin/MenuFormModal.js ---
import React, { useState, useEffect } from 'react';

const MenuFormModal = ({ isOpen, onClose, onSave, categories, initialData }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setPrice(initialData.price || '');
            setCategory(initialData.category || (categories.length > 0 ? categories[0].id : ''));
            setImage(initialData.image || '');
        } else {
            // 새 메뉴 등록 시 기본값
            setName('');
            setPrice('');
            setCategory(categories.length > 0 ? categories[0].id : '');
            setImage('');
        }
    }, [initialData, categories, isOpen]); // isOpen 추가: 모달 열릴 때마다 초기화/데이터 로드

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !price || !category) {
            alert('메뉴 이름, 가격, 카테고리는 필수 항목입니다.');
            return;
        }
        onSave({ name, price: parseInt(price), category, image });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content admin-menu-form-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{initialData ? '메뉴 수정' : '새 메뉴 등록'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="menu-name">메뉴 이름</label>
                        <input
                            type="text"
                            id="menu-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="menu-price">가격</label>
                        <input
                            type="number"
                            id="menu-price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="menu-category">카테고리</label>
                        <select
                            id="menu-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="menu-image">이미지 URL (선택)</label>
                        <input
                            type="text"
                            id="menu-image"
                            value={image}
                            placeholder="https://example.com/image.jpg"
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-save">저장</button>
                        <button type="button" onClick={onClose} className="btn-cancel">취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuFormModal;
// --- END OF FILE components/admin/MenuFormModal.js ---