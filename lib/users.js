// Mock database data
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Michael Johnson', email: 'michael@example.com' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com' },
    { id: 5, name: 'William Brown', email: 'william@example.com' },
    { id: 6, name: 'Olivia Wilson', email: 'olivia@example.com' },
    { id: 7, name: 'James Taylor', email: 'james@example.com' },
    { id: 8, name: 'Isabella Martinez', email: 'isabella@example.com' },
    { id: 9, name: 'Ethan Lee', email: 'ethan@example.com' },
    { id: 10, name: 'Sophia Harris', email: 'sophia@example.com' },
  ];
  
  // getUserList function
  const getUserList = async ({ limit = 5, offset = 0, query = '' }) => {
    // Simulate search
    const filteredUsers = mockUsers.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  
    // Pagination logic
    return filteredUsers.slice(offset, offset + limit);
  };
  
  export default { getUserList };
  