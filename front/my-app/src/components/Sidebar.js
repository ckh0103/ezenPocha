import React from 'react';

const Sidebar = ({
categories, selectedCategory, onSelectCategory
}) => {
    return(
        <div className='sidebar'>
            <ul>
                {categories.map((category) => (
                    <li key = {category.id}
                    className={selectedCategory === category.id ? 'active' : ''}
                        onClick = {() =>
                        onSelectCategory(category.id)}>
                            {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;