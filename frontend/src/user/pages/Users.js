import React from 'react'
import UsersList from '../components/UsersList'

function Users() {
  const USERS = [
    {
      id: 'u1',
      name: 'User Name',
      image:
        'https://mariannedillard.com/wp-content/uploads/2023/07/IMG_0141-2small.jpg',
      places: 3,
    },
  ]

  return <UsersList items={USERS} />
}

export default Users
