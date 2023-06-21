import { Type } from 'typescript'
import { Role } from './auth'
import { ICompany } from './companies'
import { IDataInfoMiracle, IInfoMiracle } from './request'
 
const fetchDetailRequest = (id:number|undefined) => {}

export interface INomination {
  id: string
  name: string
  levelProgress:{
  }[]
  progress:{
  }[]
  statusProgress:{
  }[]
  viewProgress:{
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
    fio: string 
    institute: string | undefined
    direction: string | undefined
    educationForm: string | undefined
    phone: string | undefined
    financingSource: string | undefined
    level: string | undefined
    course: string | number | undefined
  }
  last_status: string
  criterion: INomination
  data: IDataInfoMiracle
  sub_criterion: {
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

export interface IRequestDetailState {
  requestDetail: IRequestDetail[]
  companies: ICompany[]
  nominations: INomination[]
  statuses: string[]

  fetchDetailRequest: typeof fetchDetailRequest
}

export type { IDataInfoMiracle }
