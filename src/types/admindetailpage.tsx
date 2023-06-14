import { Type } from 'typescript'
import { Role } from './auth'
import { ICompany } from './companies'
 
const fetchDetailRequest = (id:number|undefined) => {}

export interface INomination {
  id: string
  name: string
  docs: string
  paymentVPO: number
  paymentSPO: number
  payment_status: boolean
  subNomination: {
    id: number
    name: string
    paymentVPO: number
    paymentSPO: number   
  }
  sub_criterion: {
    user_chose: number
    criterion: number
    id: number
    name: string
    paymentVPO: number
    paymentSPO: number   
  }[]
}

export interface IComment {
  admin:{
    id:number
    firstname: string
    is_staff: boolean
    lastname:string
    patronymic:string
  }
  student:{
    id: number
    lastname:string
    patronymic:string
    firstname:string
    institut: string | undefined
    profile: string | undefined
    form: string | undefined
    phone: string | undefined
    source_finance: string | undefined
    level: string | undefined
    course: string | number | undefined
    INN: string | undefined
    SNILS: string | undefined
    address: string | undefined
    fatcaddress: string | undefined
    citizenship: string | undefined

    passport_seria: string | undefined
    passport_number: string | undefined
    passport_IssueDate: string | undefined
    passport_IssueBy: string | undefined
    passport_DepartmentCode: string | undefined

  }
  created_at: Date
  imageUrl: string
  text: string
}

export interface IRequestDetail {
  id: number
  compaing: {
    name: string
    id: number
    endDate: Date
    createdOn: Date
  
  }
  student: {
    id: number
    lastname:string
    patronymic:string
    firstname:string
    institut: string | undefined
    profile: string | undefined
    form: string | undefined
    phone: string | undefined
    source_finance: string | undefined
    level: string | undefined
    course: string | number | undefined
    INN: string | undefined
    SNILS: string | undefined
    address: string | undefined
    factadress: string | undefined
    citizenship: string | undefined

    passport_seria: string | undefined
    passport_number: string | undefined
    passport_IssueDate: string | undefined
    passport_IssueBy: string | undefined
    passport_DepartmentCode: string | undefined
  }
  last_status: string
  criterion: INomination
  sub_criterion: {
    id: number
    name: string
    user_chose: number | null
    criterion: number | null
    paymentVPO: number
    paymentSPO: number
  } | null
  CreatedOn: string
  changedDate: Date
  comments: IComment[]
}

export interface IRequestDetailState {
  requestDetail: IRequestDetail[]
  companies: ICompany[]
  nominations: INomination[]
  statuses: string[]

  fetchDetailRequest: typeof fetchDetailRequest
}