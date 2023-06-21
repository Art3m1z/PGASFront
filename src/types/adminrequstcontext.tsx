import { Type } from 'typescript'
import { Role } from './auth'
import { ICompany } from './companies'
import { IDataInfoMiracle } from './request'
 


const fetchPagginatedRequests = (currentPage:number) => {}
interface INomination {
  id: string
  name: string
  docs: string
  paymentVPO: number
  paymentSPO: number
  payment_status: boolean
  subNomination: {
    id: number
    name: string  
  }[]
}

export interface IComment {
  name: string
  sendedDate: Date
  imageUrl: string
  text: string
}

export interface IRequest {
  id: number
  company: {
    name: string
    id: number
    endDate: Date
    startDate: Date
  
  }
  student: {
    id: number
    fio: string 
    institute: string | undefined
    direction: string | undefined
    educationForm: string | undefined
    phone: string | undefined
    financingSource: string | undefined
    level: string | undefined
    course: string | number | undefined
  }
  status: string
  nomination: INomination
  data: IDataInfoMiracle
  subCriterion: {
    id: number
    name: string
    user_chose: number | null
    criterion: number | null
    paymentVPO: number
    paymentSPO: number
  } | null
  createdDate: Date
  changedDate: Date
  comments: IComment[]
}

export interface IRequestPagState {
  requests: IRequest[]
  companies: ICompany[]
  nominations: INomination[]
  statuses: string[]
  count: number

  fetchPagginatedRequests: typeof fetchPagginatedRequests
}
