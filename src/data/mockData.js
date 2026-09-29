// Fake API / Mock Data
export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@yahoo.com",
    role: "Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@indonesia.com",
    role: "Designer",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@roketchiken.com",
    role: "developer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@tokopedia.com",
    role: "Developer",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@fmi.com",
    role: "Designer",
    status: "Active",
  },
  {
    id: 6,
    name: "Romario Katagame",
    email: "romariokatagame@republic.com",
    role: "Manager",
    status: "Active",
  },
];

// Simulate API delay
export const fetchUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 1000); // 1 second delay to simulate API call
  });
};

// Simulate adding a user
export const addUser = (user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = { ...user, id: mockUsers.length + 1 };
      mockUsers.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

// Simulate updating a user
export const updateUser = (id, updatedData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex((user) => user.id === id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...updatedData };
        resolve(mockUsers[index]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Simulate deleting a user
export const deleteUser = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex((user) => user.id === id);
      if (index !== -1) {
        const deletedUser = mockUsers.splice(index, 1)[0];
        resolve(deletedUser);
      } else {
        resolve(null);
      }
    }, 500);
  });
};
