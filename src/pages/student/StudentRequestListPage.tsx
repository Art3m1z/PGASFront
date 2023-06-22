import React, { FC, useContext, useLayoutEffect, useEffect, useRef, useState } from 'react'
import { StudentHeader } from '../../components/Header'
import { Link, useParams } from 'react-router-dom'
import { CompanyContext } from '../../store/CompanyContext'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import '../../index.css'
import { Checkbox } from '../../components/formFieldInput'
import $api from '../../http'
import { auto, left } from '@popperjs/core'
import axios from 'axios'

export const StudentRequestListPage: FC = () => {
  const params = useParams()
  const { requests, fetchRequests, removeRequest } =
    useContext(RequestContext)
  const { companies, fetchCompanies, nominations } = useContext(CompanyContext)

  console.log(requests)
  // function formValue2(event: React.ChangeEvent<HTMLSelectElement>) {
  //   const arr = nominations.find((e) => e.id === event.target.value)?.subNomination



  //   setState({...state, nominationRef: event.target.value.trim()});
  // }


  const { id, financingSource } = useContext(AuthContext)
  //const qs = requests.filter(r => r.student.id == id)
  const qs = requests
  const [state, setState] = useState({ nominationRef: '' });
  const formValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState({ ...state, [event.target.name]: event.target.value.trim() });
  };
  const [subArray, setSubArray] = useState<{
    user_chose: number
    criterion: number
    id: number
    name: string
    paymentVPO: number
    paymentSPO: number
  }[]>([])
  const nominationRef = useRef<HTMLSelectElement>(null)
  const subNominationRef = useRef(null)
  const createModalRef = useRef(null)
  //const request = requests.find(r => r.student.id === Number(params.id) && r.student.id == id)
  const request = requests
  const company = companies.find(r => r.id === Number(params.id))




  useEffect(() => {

    fetchRequests()
    if (companies.length) fetchCompanies()
    // if (
    //   requests
    //     .filter(r => r.company.id === Number(params.id))
    //     .filter(r => r.student.id === id).length === 0
    // )
    // navigate('/companies/')
  }, [])

  useEffect(() => {
    M.FormSelect.init(nominationRef.current!)
    M.Modal.init(createModalRef.current!)
  }, [requests])



  if (!requests.length) {
    return (
      <>
        <StudentHeader />
        <div className='my-center'>
          <div className='preloader-wrapper big active'>
            <div className='spinner-layer spinner-blue-only'>
              <div className='circle-clipper left'>
                <div className='circle'></div>
              </div>
              <div className='gap-patch'>
                <div className='circle'></div>
              </div>
              <div className='circle-clipper right'>
                <div className='circle'></div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }


  return (
    <>
      <StudentHeader />

      <div className='container'>
        {/* <div className='row'>
            <div className='col s12'> */}
        <table className='com-4 mt-4 scroll striped responsive-table'>

          <thead>
            <tr>

              <th>Кампания</th>
              <th>Номинация</th>
              <th>Статус</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>

            {qs?.map(r => {

              return (
                <tr key={r.id}>
                  <td>{r.company.name}</td>
                  <td>{r.nomination.name}</td>
                  <td>{r.status}</td>
                  <td>{r.student.institute}</td>
                  <td>{r.student.direction}</td>
                  <td>{r.student.course}</td>
                  <td>
                    <Link
                      
                      to={`/requests/${r.id}/`}
                    ><button
                    style={{width: "80%"}} 
                    className='btn light-blue darken-2 waves-effect waves-light' >
                      Редактировать
                      <i style={{ float: "right", paddingLeft: "0.2em", position: "relative", left: "8px" }} className="material-icons">
                        edite
                      </i>
                      </button>
                    </Link>
                  </td>

                  <td>

                    <a
                      className='btn red darken-2 waves-effect waves-light'
                      onClick={() => {
                        if (r.status == "Черновик") {
                          removeRequest(r.id.toString())
                          fetchRequests()
                        } else {
                          alert('Удалять заявление можно при статусе Черновик')
                        }
                      }}
                    >
                      Удалить
                      <i style={{ float: "right", paddingLeft: "0.2em" }} className="material-icons">
                        delete
                      </i>
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>


    </>
  )
}
