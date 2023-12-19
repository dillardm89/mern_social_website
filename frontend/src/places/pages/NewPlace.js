import React from 'react'
import Input from '../../shared/components/form-elements/Input'
import Button from '../../shared/components/form-elements/Button'
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import '../styles/PlaceForm.css'

function NewPlace() {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  const placeSubmitHandler = (event) => {
    event.preventDefault()

    console.log(formState.inputs) //Send this to the backend
  }

  return (
    <form className='place-form' onSubmit={placeSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        onInput={inputHandler}
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title.'
      />
      <Input
        id='address'
        element='input'
        type='text'
        label='Address'
        onInput={inputHandler}
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid address.'
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        onInput={inputHandler}
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description (at least 5 characters).'
      />

      <Button type='submit' disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  )
}

export default NewPlace
