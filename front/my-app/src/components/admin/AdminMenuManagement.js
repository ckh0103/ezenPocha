import React, { useState } from 'react';
import MenuFormModal from './MenuFormModal';

const AdminMenuGridItem = ({ item, onEdit, onDelete }) => (
    <div className="admin-menu-item">
        <img src={item.image || 'https://placehold.co/100x80/eee/aaa?text=No+Image'} alt={item.name} />
        <div className="admin-menu-item-info">
            <h4>{item.name}</h4>
            <p>{item.price.toLocaleString()}원</p>
            <p className="admin-menu-item-category">카테고리: {item.category}</p>
        </div>
        <div className="admin-menu-item-actions">
            <button onClick={() => onEdit(item)} className="admin-edit-btn">수정</button>
            <button onClick={() => onDelete(item.menuId)} className="admin-delete-btn">삭제</button>
        </div>
    </div>
);

const AdminMenuManagement = ({ menuItems, categories, onAddMenuItem, onUpdateMenuItem, onDeleteMenuItem }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveMenuItem = (itemData) => {
        if (editingItem) {
            onUpdateMenuItem({ ...editingItem, ...itemData });
        } else {
            onAddMenuItem(itemData);
        }
        handleCloseModal();
    };

    const handleDelete = (menuId) => {
        if (window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
            onDeleteMenuItem(menuId);
        }
    };

    const filteredMenuItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    return (
        <div className="admin-menu-management">
            <header className="admin-page-header">
                <h2>메뉴 관리</h2>
                <button onClick={() => handleOpenModal()} className="admin-add-btn">
                    메뉴 등록
                </button>
            </header>

            <div className="admin-category-tabs">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={selectedCategory === 'all' ? 'active' : ''}
                >
                    전체 메뉴
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={selectedCategory === cat.id ? 'active' : ''}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="admin-menu-grid">
                {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map(item => (
                        <AdminMenuGridItem
                            key={item.menuId}
                            item={item}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p>해당 카테고리에 메뉴가 없습니다.</p>
                )}
            </div>

            {isModalOpen && (
                <MenuFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveMenuItem}
                    categories={categories}
                    initialData={editingItem}
                />
            )}
        </div>
    );
};

export default AdminMenuManagement;