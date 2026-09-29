import { useState, useEffect } from 'react'
import { userService } from '../services/api.js'
import './UserList.css'

function UserList() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Developer',
    status: 'Active'
  })

  // Fetch users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Filter and sort users
  useEffect(() => {
    let result = [...users]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by role
    if (filterRole !== 'All') {
      result = result.filter(user => user.role === filterRole)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'email') {
        comparison = a.email.localeCompare(b.email)
      } else if (sortBy === 'role') {
        comparison = a.role.localeCompare(b.role)
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredUsers(result)
  }, [users, searchTerm, filterRole, sortBy, sortOrder])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAllUsers()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!newUser.name.trim()) {
      errors.name = 'Name is required'
    } else if (newUser.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    if (!newUser.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'Email is invalid'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      const createdUser = await userService.createUser(newUser)
      setUsers([...users, createdUser])
      setNewUser({ name: '', email: '', role: 'Developer', status: 'Active' })
      setFormErrors({})
      setShowForm(false)
      showNotification('User added successfully!')
    } catch (err) {
      setError('Failed to add user')
      showNotification('Failed to add user', 'error')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setShowForm(true)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      const updatedUser = await userService.updateUser(editingUser.id, newUser)
      setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user))
      setEditingUser(null)
      setNewUser({ name: '', email: '', role: 'Developer', status: 'Active' })
      setFormErrors({})
      setShowForm(false)
      showNotification('User updated successfully!')
    } catch (err) {
      setError('Failed to update user')
      showNotification('Failed to update user', 'error')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsSubmitting(true)
      try {
        await userService.deleteUser(userId)
        setUsers(users.filter(user => user.id !== userId))
        showNotification('User deleted successfully!')
      } catch (err) {
        setError('Failed to delete user')
        showNotification('Failed to delete user', 'error')
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ))
  }

  if (loading) {
    return <div className="loading">Loading users...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="user-list-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="header">
        <h2>User Management</h2>
        <button 
          className="add-btn" 
          onClick={() => setShowForm(!showForm)}
          disabled={isSubmitting}
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
          <option value="status">Sort by Status</option>
        </select>
        <button
          className="sort-order-btn"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          >
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          <select
            name="status"
            value={newUser.status}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (editingUser ? 'Update User' : 'Add User')}
          </button>
        </form>
      )}

      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="email">{user.email}</p>
              <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span>
            </div>
            <div className="user-actions">
              <span className={`status ${user.status.toLowerCase()}`}>
                {user.status}
              </span>
              <div className="action-buttons">
                <button 
                  className="edit-btn"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stats">
        <p>Total Users: {users.length}</p>
        <p>Showing: {filteredUsers.length}</p>
        <p>Active: {users.filter(u => u.status === 'Active').length}</p>
        <p>Inactive: {users.filter(u => u.status === 'Inactive').length}</p>
      </div>
    </div>
  )
}

export default UserList
