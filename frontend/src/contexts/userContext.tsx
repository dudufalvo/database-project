import { createContext, useContext, useEffect } from 'react'

import api from 'api/api'
import useRequest from 'hooks/useRequest'
import toast from 'utils/toast'

type UserType = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  nif: string;
  role: string;
}

type ProfileFormType = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

type ContextType = {
  user: UserType;
  updateUserProfile: (params?: ProfileFormType | undefined) => void;
}

const UserContext = createContext<ContextType>({ user: { first_name: '', last_name: '', email: '', phone_number: '', nif: '', role: '' }, updateUserProfile: () => { } })

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, doRequest: getUser } = useRequest(api.getUser, {
    onError: () => localStorage.removeItem('token')
  })

  const { doRequest: updateUserProfile } = useRequest<ProfileFormType>(api.updateUser, {
    onSuccess: () => {
      toast.success('Profile updated successfully')
      getUser()
    },
    onError: () => toast.error('Error updating profile')
  })

  useEffect(() => {
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserContext.Provider value={{ user: data?.user, updateUserProfile }}>
      {children}
    </UserContext.Provider >
  )
}

export const useUser = () => useContext(UserContext)
