import { Type } from 'typescript'
import { Role } from './auth'
import { ICompany } from './companies'


const setPoints = (
  id: number,
  subRId: number,
  rowIdx: number,
  points: number
) => { }
const setStatus = (id: number, status: string) => { }
const fetchSubCriterion = () => { }
const fetchRequests = () => { }
const addComment = (
  id: number,
  name: string,
  imageUrl: string,
  text: string,
  role: Role,
  userId: number
) => { }
const addRequest = (
  companyId: number,
  nomination: string,
) => { }
const addNomination = (
  id: string,
  name: string,
  docs: string,
  paymentVPO: number,
  paymentSPO: number,
  payment_status: boolean,
  sub_criterion: Array<object>

) => { }


const editeNomination = (
  id: string,
  name: string,
  docs: string,
  paymentVPO: number,
  paymentSPO: number,
  payment_status: boolean,
  sub_criterion: Array<object>

) => { }
const removeNomination = (id: string) => { }

const removeRequest = (id: string) => { }





export interface INomination {
  id: string
  name: string
  levelProgress: {
  }[]
  progress: {
  }[]
  statusProgress: {
  }[]
  viewProgress: {
  }[]
}


export interface IDataInfoMiracle {
  data: IInfoMiracle[]
}

export interface IInfoMiracle {
  dateAchivement: string
  levelMiracle: string
  linckDocs: string
  achivement: string
  documentNumber: number
  score: number
  miracle: string
  stateMiracle: string
  typeMiracle: string
  document: File | null | undefined
  documentTitle: string | undefined
  dataId: number 
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

export interface IRequestState {
  requests: IRequest[]
  companies: ICompany[]
  nominations: INomination[]
  statuses: string[]

  fetchRequests: typeof fetchRequests
  fetchSubCriterion: typeof fetchSubCriterion
  setPoints: typeof setPoints
  addComment: typeof addComment
  addRequest: typeof addRequest
  setStatus: typeof setStatus
  addNomination: typeof addNomination
  removeNomination: typeof removeNomination
  removeRequest: typeof removeRequest
  editeNomination: typeof editeNomination
}
