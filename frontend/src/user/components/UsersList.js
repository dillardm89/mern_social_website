import React from 'react'
import UserItem from './UserItem'
import Card from '../../shared/components/ui-elements/Card'
import '../styles/UsersList.css'

/**
 * Component for rendering a list of user items
 * Props passed down from Users.js
 * @param {Object} props
 * @param {Array} props.items array of objects contain user data
 * @returns {Object} user containing data passed as props to UserItem.js
 * @returns {React.JSX.Element} UsersList Element
 */
function UsersList(props) {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No Users Found!</h2>
        </Card>
      </div>
    )
  }

  return (
    <ul className='users-list'>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.imageUrl}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  )
}

export default UsersList
