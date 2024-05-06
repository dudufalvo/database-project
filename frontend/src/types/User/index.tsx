export type SignUpType = {
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  phone_number: string,
  nif: string
}

export type RecoverPasswordType = {
  email: string
}

export type ResetPasswordType = {
  password: string
}

export type ResetPasswordRequestType = {
  password: string,
  reset_token: string
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
