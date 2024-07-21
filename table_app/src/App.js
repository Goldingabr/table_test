import React, { useState } from 'react';
import Table from './components/Table';
import SearchInput from './components/SearchInput';
import './styles/App.css';

const App = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleRowClick = (user) => {
        // Логика для обработки клика на строку
        console.log('Clicked user:', user);
    };

    return (
        <div className="app">
            <Table searchQuery={searchQuery} onRowClick={handleRowClick} />
        </div>
    );
};

export default App;
