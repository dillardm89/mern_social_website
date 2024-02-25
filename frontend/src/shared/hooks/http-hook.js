import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Hook function for handling calls to API and sets abort
 * functionality if user changes / refreshes page before request completed
 * @returns {Boolean} isLoading status whether request complete or not (true/false)
 * @returns {String} isError string of error message
 * @returns {() => void} sendRequest callback to method
 * @returns {() => void}  clearError callback to method
 */
export function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const activeHttpRequests = useRef([])

  /**
   * Form method to handle sending requests to API
   * @method sendRequest
   * @param {String} url string containing API url
   * @param {String} method string of request method: GET, POST, PATCH, or DELETE
   * @param {Object} body object containing body data for request
   * @param {Object} headers object containing header data for request
   * @returns {Object} responseData from API
   */
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true)
      const httpAbortCtrl = new AbortController()
      const signal = httpAbortCtrl.signal
      activeHttpRequests.current.push(httpAbortCtrl)

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        })

        const responseData = await response.json()

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        )

        if (!response.ok) {
          throw new Error(responseData.message)
        }

        setIsLoading(false)
        return responseData
      } catch (err) {
        if (signal.aborted) {
          console.log(`Request aborted - ${err.message} `)
        } else {
          setIsError(err.message)
        }
        setIsLoading(false)
        throw err
      }
    },
    []
  )

  /**
   * Form method to clear error message (modal)
   * @method clearError
   */
  const clearError = () => {
    setIsError(null)
  }

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort())
    }
  }, [])

  return { isLoading, isError, sendRequest, clearError }
}
