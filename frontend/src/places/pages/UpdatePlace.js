import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Input from '../../shared/components/form-elements/Input'
import Button from '../../shared/components/form-elements/Button'
import Card from '../../shared/components/ui-elements/Card'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import '../styles/PlaceForm.css'

function UpdatePlace(props) {
  const API_URL = process.env.API_URL
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()
  const [loadedPlace, setLoadedPlace] = useState(null)
  const placeId = useParams().pid
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
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

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${API_URL}/api/places/${placeId}`
        )

        setLoadedPlace(responseData.place)

        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        )
      } catch (err) {
        //console.log(err.message)
      }
    }

    fetchPlace()
  }, [sendRequest, placeId, setFormData])

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      await sendRequest(
        `${API_URL}/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
        }
      )
      navigate(`/${auth.userId}/places`)
    } catch (err) {
      //console.log(err.message)
    }
  }

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlace && !isError) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ErrorModal error={isError} onClear={clearError} />

      {!isLoading && loadedPlace && (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialIsValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (at least 5 characters).'
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialIsValid={true}
          />

          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  )
}

export default UpdatePlace
