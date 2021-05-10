import {User} from "../types/User";

export const saveUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getUser = (): User | null => {
  const str = localStorage.getItem("user")
  return str !== null ? JSON.parse(str) : null
}

export const cleanUser = () => {
  localStorage.removeItem("user")
}
