import { createContext, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import api from 'api/api'
import useRequest from 'hooks/useRequest'
import toast from 'utils/toast'

type UserType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image_url: string;
}

type ContextType = {
  user: UserType;
  updateUserProfile: (params?: FormData | undefined) => void;
}

const UserContext = createContext<ContextType>({ user: { id: '', name: '', email: '', phone: '', image_url: '' }, updateUserProfile: () => { } })

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const { data, doRequest: getUser } = useRequest(api.getUser, {
    onError: () => navigate('/sign-in')
  })

  const { doRequest: updateUserProfile } = useRequest<FormData>(api.updateUser, {
    onSuccess: () => getUser(),
    onError: () => toast.error('Error updating profile')
  })

  useEffect(() => {
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserContext.Provider value={{ user: data?.data?.user, updateUserProfile }}>
      {children}
    </UserContext.Provider >
  )
}

export const useUser = () => useContext(UserContext)
