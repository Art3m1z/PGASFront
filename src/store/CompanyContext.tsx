import React, { createContext, ReactElement, useReducer } from 'react'
import { ICompanyState, IAction, ICompany } from '../types/companies'
import $api from '../http'

const initialState: ICompanyState = {
  nominations: [],
  companies: [],
  fetchCompanies: () => { },
  deleteCompany: () => { },
  createCompany: () => { },
  editCompany: () => { },
}

interface IProps {
  children?: ReactElement
}

const reducer = (state = initialState, action: IAction): ICompanyState => {
  switch (action.type) {
    case 'SET_COMPANIES':
      return { ...state, companies: action.payload }
    case 'SET_NOMINATIONS':
      return { ...state, nominations: action.payload }
    case 'CREATE_COMPANY':
      return {
        ...state,
        companies: [
          ...state.companies,
          {
            id: action.payload.id,
            name: action.payload.name,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
          },
        ],
      }
    case 'EDIT_COMPANY':
      return {
        ...state,
        companies: state.companies.map(c => {
          if (c.id == action.payload.id) {
            c.name = action.payload.name
            c.startDate = action.payload.startDate
            c.endDate = action.payload.endDate
          }
          return c
        }),
      }
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(c => c.id !== action.payload),
      }
    default:
      return state
  }
}

export const CompanyContext = createContext(initialState)

export const CompanyProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchCompanies = async () => {
    try {
      // fetch

      const resp = await $api.get('/api/companies/get/')

      let nom = await $api.get('/api/nominations/get/')
      const nominations = nom.data

      const payload: ICompany[] = resp.data

      dispatch({
        type: 'SET_COMPANIES',
        payload: payload.map(p => ({
          ...p,
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
        }
        )),
      })
      dispatch({
        type: 'SET_NOMINATIONS',
        payload: nominations,
      })
      
    } catch (e) {
      dispatch({
        type: 'SET_COMPANIES',
        payload: [
          {
            id: 1,
            name: `Ошибка при получении данных: ${e}`,
            startDate: new Date(),
            endDate: new Date(),
          },
        ],
      })
    }
  }
  const deleteCompany = async (id: number) => {
    // fetch

    await $api.delete(`/api/companies/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    dispatch({
      type: 'DELETE_COMPANY',
      payload: id,
    })
  }
  const createCompany = async (
    name: string,
    startDate: Date,
    endDate: Date
  ) => {
    // fetch
    // get id from fetch

    const resp = await $api.post('/api/companies/create/', {
      name,
      startDate: startDate,
      endDate: endDate,
    })

    const data = resp.data

    dispatch({
      type: 'CREATE_COMPANY',
      payload: {
        id: data.id,
        name,
        startDate,
        endDate,
      },
    })
  }
  const editCompany = async (
    id: number,
    name: string,
    startDate: Date,
    endDate: Date
  ) => {
    // fetch

    await $api.put(`/api/companies/${id}/`, {
      name,
      startDate: startDate,
      endDate: endDate,
    })

    dispatch({
      type: 'EDIT_COMPANY',
      payload: {
        id,
        name,
        startDate,
        endDate,
      },
    })
  }

  return (
    <CompanyContext.Provider
      value={{
        ...state,
        fetchCompanies,
        createCompany,
        deleteCompany,
        editCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}
