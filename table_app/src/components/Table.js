import React, { useState, useEffect, useRef, useMemo } from 'react';
import TableRow from './TableRow';
import SearchInput from './SearchInput';
import '../styles/Table.css';

// Функция для получения пользователей
const fetchUsers = async () => {
  try {
    const response = await fetch('https://dummyjson.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error(`Fetch failed with status ${error.message}`);
  }
};

// Функция для поиска пользователей
const searchUsers = async (query) => {
  try {
    const response = await fetch('https://dummyjson.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // Фильтрация пользователей на клиенте
    const filteredUsers = data.users.filter(user => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const city = user.address?.city?.toLowerCase() || '';
      const street = user.address?.street?.toLowerCase() || '';
      const queryLower = query.toLowerCase();

      return fullName.includes(queryLower) ||
        (user.age && user.age.toString().includes(queryLower)) ||
        (user.gender && user.gender.toLowerCase().includes(queryLower)) ||
        (user.phone && user.phone.includes(queryLower)) ||
        city.includes(queryLower) ||
        street.includes(queryLower);
    });
    return filteredUsers;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw new Error(`Search failed with status ${error.message}`);
  }
};

const Table = ({ onRowClick }) => {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [columnWidths, setColumnWidths] = useState({
    firstName: 150,
    age: 100,
    gender: 100,
    phone: 150,
    address: 200,
  });
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const tableContainerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        setUsers(users);
        setError(null);
        setErrorCode(null);
      } catch (error) {
        setError('Ошибка при загрузке данных');
        setErrorCode(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const search = async () => {
      if (searchQuery) {
        try {
          const users = await searchUsers(searchQuery);
          setUsers(users);
          setError(null);
          setErrorCode(null);
        } catch (error) {
          setError('Ошибка при поиске пользователей');
          setErrorCode(error.message);
        }
      } else {
        try {
          const users = await fetchUsers();
          setUsers(users);
          setError(null);
          setErrorCode(null);
        } catch (error) {
          setError('Ошибка при загрузке данных');
          setErrorCode(error.message);
        }
      }
    };

    search();
  }, [searchQuery]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key && sortConfig.direction) {
      sortableUsers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Для сортировки по адресу
        if (sortConfig.key === 'address') {
          aValue = `${a.address?.city || ''} ${a.address?.street || ''}`;
          bValue = `${b.address?.city || ''} ${b.address?.street || ''}`;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(user => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const city = user.address?.city?.toLowerCase() || '';
      const street = user.address?.street?.toLowerCase() || '';
      const searchQueryLower = searchQuery?.toLowerCase() || '';

      return fullName.includes(searchQueryLower) ||
        (user.age && user.age.toString().includes(searchQueryLower)) ||
        (user.gender && user.gender.toLowerCase().includes(searchQueryLower)) ||
        (user.phone && user.phone.includes(searchQueryLower)) ||
        city.includes(searchQueryLower) ||
        street.includes(searchQueryLower);
    });
  }, [sortedUsers, searchQuery]);

  const startResizing = (e, key) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[key];

    const handleResizing = (e) => {
      const newWidth = Math.max(50, startWidth + e.clientX - startX);
      setColumnWidths(prevWidths => ({
        ...prevWidths,
        [key]: newWidth
      }));
    };

    const stopResizing = () => {
      document.removeEventListener('mousemove', handleResizing);
      document.removeEventListener('mouseup', stopResizing);
    };

    document.addEventListener('mousemove', handleResizing);
    document.addEventListener('mouseup', stopResizing);
  };

  return (
    <div className="table-container" ref={tableContainerRef}>
      {error && (
        <div className="error-message">
          {error} <br />
          {errorCode && <span className="error-code">Код ошибки: {errorCode}</span>}
        </div>
      )}
      <div className="search-container">
        <SearchInput onSearch={setSearchQuery} />
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th style={{ width: columnWidths.firstName }} onClick={() => requestSort('firstName')}>
              ФИО
              {sortConfig.key === 'firstName' && (
                sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : ''
              )}
              <div className="resize-handle" onMouseDown={(e) => startResizing(e, 'firstName')} />
            </th>
            <th style={{ width: columnWidths.age }} onClick={() => requestSort('age')}>
              Возраст
              {sortConfig.key === 'age' && (
                sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : ''
              )}
              <div className="resize-handle" onMouseDown={(e) => startResizing(e, 'age')} />
            </th>
            <th style={{ width: columnWidths.gender }} onClick={() => requestSort('gender')}>
              Пол
              {sortConfig.key === 'gender' && (
                sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : ''
              )}
              <div className="resize-handle" onMouseDown={(e) => startResizing(e, 'gender')} />
            </th>
            <th style={{ width: columnWidths.phone }} onClick={() => requestSort('phone')}>
              Номер телефона
              <div className="resize-handle" onMouseDown={(e) => startResizing(e, 'phone')} />
            </th>
            <th style={{ width: columnWidths.address }} onClick={() => requestSort('address')}>
              Адрес
              {sortConfig.key === 'address' && (
                sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : ''
              )}
              <div className="resize-handle" onMouseDown={(e) => startResizing(e, 'address')} />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <TableRow key={user.id} user={user} onClick={() => onRowClick(user)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
