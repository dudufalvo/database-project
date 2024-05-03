export type SignUpType = {
  name: string,
  email: string,
  password: string,
  password_confirmation: string
}

export type InputFormType = {
  label: string,
  type: string,
  name: keyof SignUpType,
  id: string,
  placeholder: string,
}

export type SignInType = {
  email: string,
  password: string,
  rememberMe: boolean,
}

export type BasicUserType = {
  id: string,
  name: string,
  image_url: string
}

export type UserDataType = BasicUserType & {
  email: string,
  phone: string
}

export type UserGroupResponseType = BasicUserType & {
  phone?: string,
  is_admin: boolean
}

export type UserResponseType = {
  data: {
    users: UserGroupResponseType[]
  }
}
