import { useState, useCallback } from 'react'

import type { AxiosError } from 'axios'

type OptionsProps<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};

const useRequest = <TRequest, TData = null>(requestFunc: (params: TRequest) => Promise<{ data: TData }>, options?: OptionsProps<TData>) => {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)

  const doRequest = useCallback(
    (params?: TRequest) => {
      setError(null)

      requestFunc(params as TRequest)
        .then(({ data }) => {
          setData(data)
          options?.onSuccess?.(data)
        })
        .catch((error: Error | AxiosError) => {
          setData(null)
          setError(error)
          options?.onError?.(error)
        })
        .finally(() => setLoading(false))
    },
    [requestFunc, options],
  )

  return {
    doRequest,
    data,
    isLoading,
    error,
  }
}

export default useRequest
