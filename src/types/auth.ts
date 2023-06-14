const login = (id: number, fio: string,  financingSource: string,  avatarUlr: string, role: Role) => {}

export interface IAuthState {
  id: number
  fio: string
  financingSource: string
  avatarUrl: string
  role: Role
  
  login: typeof login
}

export type Role = 'admin' | 'student' | 'anonymous'
