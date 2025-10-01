import React from 'react';
import Select from 'react-select';

function CustomSelectInput({ label, items, onSelected }) {
    
    const handleChange = (selectedOption) => {
        if (onSelected) {
            onSelected(selectedOption);
        }
    };

    return (
        <Select
            options={items}
            onChange={handleChange} 
            placeholder={label} 
            isClearable={true}
            isSearchable={true}
        />
    );
}

export default CustomSelectInput;