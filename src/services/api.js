// API Service - Handle all API calls
import { fetchUsers, addUser, updateUser, deleteUser } from '../data/mockData.js'

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const users = await fetchUsers()
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Add a new user
  createUser: async (userData) => {
    try {
      const newUser = await addUser(userData)
      return newUser
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  // Update an existing user
  updateUser: async (id, userData) => {
    try {
      const updatedUser = await updateUser(id, userData)
      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    try {
      const deletedUser = await deleteUser(id)
      return deletedUser
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}
