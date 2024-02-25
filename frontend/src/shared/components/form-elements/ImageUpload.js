import React, { useRef, useState, useEffect } from 'react'
import Button from './Button'
import './styles/ImageUpload.css'

/**
 * Component for rendering image upload element
 * Props passed down from Auth.js or NewPlace.js
 * @param {Object} props
 * @param {String} props.id string for setting CSS id
 * @param {String} props.center string for setting CSS class name
 * @param {String} props.errorText string to set error message for invalid field entry
 * @param {() => void} props.onInput callback function for handling input (form-hook.js)
 * @returns {React.JSX.Element} ImageUpload Element
 */
function ImageUpload(props) {
  const filePickerRef = useRef()
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isValid, setIsValid] = useState(false)

  const pickedHandler = (event) => {
    let pickedFile
    let fileIsValid = isValid
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0]
      setFile(pickedFile)
      setIsValid(true)
      fileIsValid = true
    } else {
      setIsValid(false)
      fileIsValid = false
    }

    props.onInput(props.id, pickedFile, fileIsValid)
  }

  const pickImageHandler = () => {
    filePickerRef.current.click()
  }

  useEffect(() => {
    if (!file) {
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      const { result } = event.target
      setPreviewUrl(result)
    }
    fileReader.readAsDataURL(file)
  }, [file])

  return (
    <div className='form-control'>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg,.png,.jpeg'
        onChange={pickedHandler}
      />

      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='preview' />}
          {!previewUrl && <p>Please choose an image.</p>}
        </div>

        <Button type='button' onClick={pickImageHandler}>
          Select An Image
        </Button>
      </div>
    </div>
  )
}

export default ImageUpload
