import {type } from "os"
import React, {createContext, ReactElement, useReducer} from "react"
import $api from "../http"
import { Role } from "../types/auth"
import { IAction } from "../types/companies"
import { IRequestPagState } from "../types/adminrequstcontext"

const initialState: IRequestPagState = {
    requests: [],
    nominations: [],
    companies: [],
    statuses: [],
    count: 0,
  
    fetchPagginatedRequests: () => { },
}

interface IProps{
    children?: ReactElement
}

const reducer = (
    state = initialState,
    { payload, type }: IAction
  ): IRequestPagState => {
    switch (type) {
      case 'SET_REQUESTS':
        return {
          ...state,
          ...payload,
        }
      default:
        return state
    }
  }
  
export const AdminRequestPaginateContext = createContext(initialState)
export const RequestPaginateProvider = ({ children } :IProps)=>{
    const [state,dispatch] = useReducer(reducer,initialState)

    const fetchPagginatedRequests = async (currentPage:number) => {
      try {
        // fetch
  
        let resp =  await $api.get(`/api/requests/get/?page=${currentPage}`)
        //console.log(resp.data)
        const requests = resp.data.results

        const count = resp.data.count
  
        let nom = await $api.get('/api/criterion/get/')
        const nominations = nom.data
        //console.log(nominations)
  
        let comp = await $api.get('/api/companies/get/')
        const companies = comp.data
        //console.log(companies)
  
        const statuses = [
          'Отправлено на рассмотрение',
          'Получение выплаты',
          'Черновик',
          'Принято',
          'Удалено',
          'Отправлено на доработку',
          'Отказать по решению Стипендиальной Комиссии',
        ]
        
        dispatch({
          type: 'SET_REQUESTS',
          payload: {
            requests: requests.map((r: any) => {
              return {
                id: r.id,
                company: {
                  id: r.compaing.id,
                  name: r.compaing.name,
                  endDate: r.compaing.endDate,
                  
                },
                student: {
                  id: r.student.id,
                  institute: r.student.institut,
                  direction: r.student.profile,
                  educationForm: r.student.form,
                  fio: `${r.student.lastname} ${r.student.firstname} ${r.student.patronymic}`,
                  phone: r.student.phone,
                  financingSource: r.student.source_finance,
                  level: r.student.level,
                  course: r.student.course,
                  INN: r.student.INN,
                  SNILS: r.student.SNILS,
                  address: r.student.address,
                  factaddress: r.student.factadress,
                  citizenship: r.student.citizenship,
    
                  passport_seria: r.student.passport_seria,
                  passport_number: r.student.passport_number,
                  passport_IssueDate: r.student.passport_IssueDate,
                  passport_IssueBy: r.student.passport_IssueBy,
                  passport_DepartmentCode: r.student.passport_DepartmentCode,
                },
                status: r.last_status,
                nomination: {
                  name: r.criterion.name,
                  docs: r.criterion.docs,
                  paymentVPO: r.criterion.paymentVPO,
                  paymentSPO: r.criterion.paymentSPO,
                  payment_status: r.criterion.payment_status
                },
                subCriterion: {
                  criterion: r.sub_criterion?.criterion,
                  id: r.sub_criterion?.id,
                  name: r.sub_criterion?.name,
                  paymentSPO: r.sub_criterion?.paymentSPO,
                  paymentVPO: r.sub_criterion?.paymentVPO,
                  user_chose: r.sub_criterion?.user_chose
                },
                createdDate: new Date(r.CreatedOn),
                changedDate: new Date(r.LastUpdate),
                comments: r.comments.map((c: any) => ({
                  name: c.student
                    ? `${c.student.lastname} ${c.student.firstname} ${c.student.patronymic}`
                    : `${c.admin.lastname} ${c.admin.firstname} ${c.admin.patronymic}`,
                  imageUrl: c.student ? c.student.avatar : c.admin.avatar,
                  sendedDate: new Date(c.created_at),
                  text: c.text,
                })),
              }
            }),
            statuses,
            nominations,
            companies,
            count,
          },
        })
      } catch (e) {
          console.log(e)
      }
    }

    return(
        <AdminRequestPaginateContext.Provider
            value={{
                ...state,
                fetchPagginatedRequests,
            }}
            
        >
            {children}
        </AdminRequestPaginateContext.Provider>
    )
}