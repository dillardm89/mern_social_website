import React, { useState, useContext } from 'react'
import Card from '../../shared/components/ui-elements/Card'
import Input from '../../shared/components/form-elements/Input'
import Button from '../../shared/components/form-elements/Button'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import ImageUpload from '../../shared/components/form-elements/ImageUpload'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import { AuthContext } from '../../shared/context/auth-context'
import '../styles/Auth.css'

/**
 * Page for rendering user sign up or login
 * @returns {React.JSX.Element} Auth Element
 */
function Auth() {
  const auth = useContext(AuthContext)
  const API_URL = process.env.REACT_APP_API_URL
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      )
    }

    setIsLoginMode((prevMode) => !prevMode)
  }

  const authSubmitHandler = async (event) => {
    event.preventDefault()

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${API_URL}/api/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        )
        auth.login(responseData.userId, responseData.token)
      } catch (err) {
        //console.log(err.message)
      }
    } else {
      try {
        const formData = new FormData()
        formData.append('name', formState.inputs.name.value)
        formData.append('email', formState.inputs.email.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('image', formState.inputs.image.value)

        const responseData = await sendRequest(
          `${API_URL}/api/users/signup`,
          'POST',
          formData
        )
        auth.login(responseData.userId, responseData.token)
      } catch (err) {
        //console.log(err.message)
      }
    }
  }

  return (
    <>
      <ErrorModal error={isError} onClear={clearError} />

      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}

        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id='name'
              type='text'
              element='input'
              label='Your Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a valid name.'
              onInput={inputHandler}
            />
          )}

          <Input
            id='email'
            element='input'
            type='email'
            label='Email'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}
          />

          <Input
            id='password'
            element='input'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(12)]}
            errorText='Please enter a valid password (at least 12 characters).'
            onInput={inputHandler}
          />

          {!isLoginMode && (
            <ImageUpload
              center
              id='image'
              onInput={inputHandler}
              errorText='Please select an image.'
            />
          )}

          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGN UP'}
          </Button>
        </form>

        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGN UP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  )
}

export default Auth
