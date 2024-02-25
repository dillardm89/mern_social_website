import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../shared/components/form-elements/Input'
import Button from '../../shared/components/form-elements/Button'
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'
import ImageUpload from '../../shared/components/form-elements/ImageUpload'
import '../styles/PlaceForm.css'

/**
 * Page for rendering form to create new place
 * @returns {React.JSX.Element} NewPlace Element
 */
function NewPlace() {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const API_URL = process.env.REACT_APP_API_URL
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()

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

  const placeSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData()
      formData.append('title', formState.inputs.title.value)
      formData.append('address', formState.inputs.address.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('image', formState.inputs.image.value)

      await sendRequest(`${API_URL}/api/places`, 'POST', formData, {
        Authorization: 'Bearer ' + auth.token,
      })
      navigate(`/${auth.userId}/places`)
    } catch (err) {
      //console.log(err.message)
    }
  }

  return (
    <>
      <ErrorModal error={isError} onClear={clearError} />

      <form className='place-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}

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

        <ImageUpload
          center
          id='image'
          onInput={inputHandler}
          errorText='Please select an image.'
        />

        <Button type='submit' disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  )
}

export default NewPlace
