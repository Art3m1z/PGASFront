import { type } from 'os'
import React, { createContext, ReactElement, useReducer } from 'react'
import $api from '../http'
import { Role } from '../types/auth'
import { IAction } from '../types/companies'
import { IRequestState, IRequest, IInfoMiracle } from '../types/request'

const initialState: IRequestState = {
  requests: [],
  nominations: [],
  companies: [],
  statuses: [],

  fetchRequests: () => { },
  fetchSubCriterion: () => { },
  setPoints: () => { },
  addComment: () => { },
  addRequest: () => { },
  setStatus: () => { },
  addNomination: () => { },
  removeNomination: () => { },  
  removeRequest: () => { },
  editeNomination: () => { },
}


interface IProps {
  children?: ReactElement
}

const reducer = (
  state = initialState,
  { payload, type }: IAction
): IRequestState => {
  switch (type) {
    case 'SET_REQUESTS':
      return {
        ...state,
        ...payload,
      }
    case 'SET_POINTS':
      return {
        ...state,
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
    case 'ADD_REQUEST':
      return {
        ...state,
        requests: [...state.requests, payload]
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
    
    case 'ADD_NOMINATION':
      return {
        ...state,
        nominations: [...state.nominations, payload],
      }
    case 'EDITE_NOMINATION':
    return {
      ...state,
      nominations: [...state.nominations, payload],
    }
    case 'REMOVE_NOMINATION':
      return {
        ...state,
        nominations: state.nominations.filter(n => n.name !== payload.name),
      }
    case "REMOVE_REQUEST":
      return {
        ...state,
        requests: state.requests.filter(n => n.id !== payload.id)
      }
    default:
      return state
  }
}


export const RequestContext = createContext(initialState)

export const RequestProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchRequests = async () => {
    try {
      // fetch

      let resp = await $api.get(`/api/requests/get`)
      const requests = resp.data


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

                levelProgress: {
                  level: r.typeMiracle.dict_level_progress,
                },
                progress: {
                  progress: r.typeMiracle.dict_progress,
                },

                statusProgress: {
                  statusProgress: r.typeMiracle.dict_status_progress,
                },

                viewProgress: {
                  viewProgress: r.typeMiracle.dict_view_progress,
                },

              },
              data: {data: r.data.map((d: any) => (
                {
                  dateAchivement: d?.date_event, 
                  levelMiracle: d?.level_progress,
                  linckDocs: d?.linkDocs,
                  achivement: d?.name,
                  documentNumber: parseInt(d?.number_of_docs, 10),
                  score: d?.point,
                  miracle: d?.progress,
                  stateMiracle: d?.status_progress,
                  typeMiracle: d?.view_progress,
                  dataId: d?.id
                  
                  }
                
              )) },
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

        },
      })
      
    } catch (e) {
        console.log(e)
    }
  }
  
  const setPoints = (
    id: number,
    subRId: number,
    rowIdx: number,
    points: number
  ) =>
    dispatch({
      type: 'SET_POINTS',
      payload: {
        id,
        rowIdx,
        points,
        subRId,
      },
    })




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
  const addRequest = async (
    companyId: number,
    nomination: string,
  ) => {
    // fetch
    // get id and subRequests from fetch


    const resp = await $api.post('/api/requests/create/', {
      company_id: companyId,
      nomination,
    });


    const newRequest = {
      id: resp.data.id,
      company: {
        id: resp.data.compaing.id,
        name: resp.data.compaing.name,
        endDate: resp.data.compaing.endDate,
      },
      comments: resp.data.comments,
      nomination: resp.data.criterion,
      subCriterion: resp.data.sub_criterion,
      status: resp.data.last_status,  
      student: {  
        id: resp.data.student.id,
        institute: resp.data.student.institut,
        direction: resp.data.student.learningPlan,
        course: resp.data.student.course,
        educationForm: resp.data.student.form,
        fio: `${resp.data.student.lastname} ${resp.data.student.firstname} ${resp.data.student.patronymic}`,
        phone: resp.data.student.phone,
        financingSource: resp.data.student.source_finance,
        level: resp.data.student.level,
        INN: resp.data.student.INN,
        SNILS: resp.data.student.SNILS,
        address: resp.data.student.address,
        fatcaddress: resp.data.student.factadress,
        citizenship: resp.data.student.citizenship,

        passport_seria: resp.data.student.passport_seria,
        passport_number: resp.data.student.passport_number,
        passport_IssueDate: resp.data.student.passport_IssueDate,
        passport_IssueBy: resp.data.student.passport_IssueBy,
        passport_DepartmentCode: resp.data.student.passport_DepartmentCode,
      },
      createdDate: new Date(resp.data.CreatedOn),
      changedDate: new Date(resp.data.LastUpdate),
    };

    const payload = {}

    dispatch({
      type: 'ADD_REQUEST',
      payload: newRequest,
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
  const addNomination = async (
    id: string,
    name: string,
    docs: string,
    paymentVPO: number,
    paymentSPO: number,
    payment_status: boolean,
    sub_criterion: Array<object>
  ) => {
    await $api.post('/api/criterion/get/', {
      name,
      docs,
      paymentVPO,
      paymentSPO,
      payment_status,
      sub_criterion,

    })

    dispatch({
      type: 'ADD_NOMINATION',
      payload: {
        name,
        docs,
        paymentVPO,
        paymentSPO,
        payment_status,
        sub_criterion,
      },
    })
  }

  const editeNomination = async (
    id: string,
    name: string,
    docs: string,
    paymentVPO: number,
    paymentSPO: number,
    payment_status: boolean,
    sub_criterion: Array<object>

  ) => {
    const r = await $api.put(`/api/criterion/${id}/`, {
      name,
      docs,
      paymentVPO,
      paymentSPO,
      payment_status,
      sub_criterion


    })

    dispatch({
      type: 'ADD_NOMINATION',
      payload: {
        name,
        docs,
        paymentVPO,
        paymentSPO,
        payment_status,
      },
    })
  }
  const removeNomination = async (id: string) => {
    await $api.delete(`/api/criterion/${id}/`)

    dispatch({
      type: 'REMOVE_NOMINATION',
      payload: {
        id,
      },
    })
  }

  const removeRequest = async (id: string) => {
    await $api.delete(`/api/requests/get/${id}`)

    dispatch({
      type: 'REMOVE_REQUEST',
      payload: {
        id,
      },
    })
  }
  

  return (
    <RequestContext.Provider
      value={{
        ...state,
        fetchRequests,
        setPoints,
        addComment,
        addRequest,
        setStatus,
        addNomination,
        removeNomination,
        removeRequest,
        editeNomination
      }}
    >
      {children}
    </RequestContext.Provider>
  )
}

function _(date?: Date) {
  if (date === undefined) return ''

  const m = date.getMonth() + 1
  const d = date.getDate()

  return `${date.getFullYear()}-${m >= 10 ? m : '0' + m}-${
    d >= 10 ? d : '0' + d
  }`
}
