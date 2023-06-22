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
    addComment: () => { },
    setStatus: ()=>{ },
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
      case 'ADD_COMMENT':

        return {
          ...state,
          requests: state.requests.map(r => {
            if (r.id === payload.id) {
              r.comments.push({
                name: payload.name,
                imageUrl: payload.imageUrl,
                text: payload.text,
                sendedDate: new Date(),
              })
            }
  
            return r
          }),
        }
        case 'SET_STATUS':
          return {
            ...state,
            requests: state.requests.map(r => {
              console.log(payload)
              if (r.id === payload.id) {
                r.status = payload.status
              }
    
              return r
            }),
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
       
        const requests = resp.data.results
        console.log(requests)

        const count = resp.data.count
  
        let nom = await $api.get('/api/nominations/get/')
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
                },
                status: r.last_status,
                nomination: {
                  name: r.typeMiracle.name,
                  id: r.typeMiracle.id,

                  levelProgress:{
                    level: r.typeMiracle.dict_level_progress,
                  },
                  progress:{
                    progress:r.typeMiracle.dict_progress,
                  },
                  statusProgress:{
                    statusProgress:r.typeMiracle.dict_status_progress,
                  },
                  viewProgress:{
                    viewProgress: r.typeMiracle.dict_view_progress,
                  },
                },

                data: {data: r.data.map((d:any)=>(
                  {
                    dateAchivement:new Date(d?.date_event),
                    levelMiracle:d?.level_progress,
                    linckDocs: d?.linkDocs,
                    achivement:d?.name,
                    documentNumber: parseInt(d?.number_of_docs, 10),
                    score: d?.point,
                    miracle:d?.progress,
                    stateMiracle: d?.status_progress,
                    typeMiracle:d?.view_progress,
                    dataId: d?.id
                  }
                ))},

                createdDate: new Date(r.CreatedOn),
                changedDate: new Date(r.LastUpdate),
                comments: r.comments.map((c: any) => ({
                  name: c.student
                    ? `${c.student?.lastname} ${c.student?.firstname} ${c.student?.patronymic}`
                    : `${c.admin?.lastname} ${c.admin?.firstname} ${c.admin?.patronymic}`,
                  imageUrl: c.student ? c.student?.avatar : c.admin?.avatar,
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
    const addComment = async (
      id: number,
      name: string,
      imageUrl: string,
      text: string,
      role: Role,
      userId: number
    ) => {
      // fetch
  
      await $api.post('/api/comments/create/', {
        role,
        text,
        id,
        user_id: userId,
      })
  
      dispatch({
        type: 'ADD_COMMENT',
        payload: {
          id,
          name,
          imageUrl,
          text,
        },
      })
    }

  const setStatus = async (id: number, status: string) => {
      // fetch
  
      await $api.put(`/api/requests/get/`, {
        "status": status,
        "id": id
      })
  
      dispatch({
        type: 'SET_STATUS',
        payload: {
          id,
          status,
        },
      })
    }

    return(
        <AdminRequestPaginateContext.Provider
            value={{
                ...state,
                fetchPagginatedRequests,
                setStatus,
                addComment
            }}
            
        >
            {children}
        </AdminRequestPaginateContext.Provider>
    )
}