import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import {AdminRequestPaginateContext} from '../../store/AdminRequestContext'
import M from 'materialize-css'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'
import { CompanyContext } from '../../store/CompanyContext'
import { Link } from 'react-router-dom'
import "../../admin.css"
import { read } from 'fs'
import { type } from 'os'
import { error } from 'console'

export const AdminRequestListPage: FC = () => {

  const { requests,count,nominations, statuses, fetchPagginatedRequests } = useContext(AdminRequestPaginateContext)
 
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageLimit, setMaxPageLimit] = useState(2);
  const [qs, setQs] = useState<{
    id: undefined | number
    criterion:{
      name:undefined | string
    }
    student: {
      lastname : undefined | string
      firstname : undefined | string
      patronymic: undefined | string
      institut: undefined | string
      profile: undefined | string
      form : undefined | string
    }
    CreatedOn:  Date
    last_status: undefined | string
    
  }[]>([])
  const { companies, fetchCompanies } = useContext(CompanyContext)
  const [fio, setFio] = useState('')
  const [s1, setS1] = useState("-1")
  const [s2, setS2] = useState("-1")
  const [s3, setS3] = useState("-1")
  const [loading, setLoading] = useState(false)
  const select1 = useRef(null)
  const select2 = useRef(null)
  const select3 = useRef(null)
  const select_test = useRef(null)
  const nominationRef = useRef(null)
  const nominationRef2 = useRef(null)
  const VoSpoRef = useRef(null) 
  const companyRef = useRef(null)
  const companyRef2 = useRef(null)
  const faceRef = useRef(null)
  const _ = useFormater()

  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  }
  // const pageLimit=()=>{
  //   setMaxPages(Math.ceil(count / maxPageLimit))
  // }
  useEffect(() => {
    fetchPagginatedRequests(currentPage);
    setMaxPageLimit(Math.ceil(count / 20));
  }, [currentPage,count,])
  console.log(requests)

  useEffect(() => {
    M.FormSelect.init(select1.current!)
    M.FormSelect.init(select2.current!)
    M.FormSelect.init(select3.current!)
    const elems = document.querySelectorAll('.modal')
    M.Modal.init(elems)
    console.log("iam here")
    M.FormSelect.init(nominationRef.current!)
    M.FormSelect.init(VoSpoRef.current!)
    M.FormSelect.init(nominationRef2.current!)
    M.FormSelect.init(companyRef.current!)
    M.FormSelect.init(companyRef2.current!)
    M.FormSelect.init(faceRef.current!)
    //findClickHandler()
    // pageLimit()
  }, [requests.length])

  const findClickHandler = async () =>{
    setLoading(true)
    try {
      //@ts-ignore
    const resp = await $api.post(`/api/search/request/`, {
      // 'lastname':fio?.substring(0, fio.search(" ")),
      // "firstname":fio?.substring(fio.search(' '), fio.lastIndexOf(' ')),
      // 'patronymic': fio?.substring(fio.lastIndexOf(' ')),
      "fio": fio,
      //@ts-ignore
      "company_pk" :  select1.current!.value, 
      //@ts-ignore
      "criterion": select2.current!.value,
      //@ts-ignore
      "status": select3.current!.value

    }).then((resp) => {setQs(resp.data); setLoading(false)})
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    
    M.FormSelect.init(select1.current!)
    M.FormSelect.init(select2.current!)
    M.FormSelect.init(select3.current!)
    // const elems = document.querySelectorAll('.modal')
    // M.Modal.init(elems)
    console.log("iam here")

    
  }
//console.log(qs)
  
  // const findClickHandler = (clearFio = false) => {
  //     requests
  //       .filter(r => {
  //         if (!clearFio)
  //            return r?.student?.fio?.toLowerCase()?.indexOf(fio?.toLowerCase()) + 1
             
  //         else return true
  //       })
  //       .filter(r => {
  //         const company_cond =
  //           // @ts-ignore
  //           select1.current.value != -1
  //             ? // @ts-ignore
  //               r.company.id == select1.current.value!
                
  //             : true
  //         const nomination_cond =
  //           // @ts-ignore
  //           select2.current.value! != -1
  //             ? // @ts-ignore
  //               r.nomination.name == select2.current.value!
  //             : true
  //         const status_cond =
  //           // @ts-ignore
  //           select3.current.value! != -1
  //             ? // @ts-ignore
  //               r.status == select3.current.value!
  //             : true

  //         return company_cond && nomination_cond && status_cond
  //       })
  // }
 

  const resetClickHanlder = () => {
    // @ts-ignore
    select1.current!.value = -1
    // @ts-ignore
    select2.current!.value = -1
    // @ts-ignore
    select3.current!.value = -1

    document.cookie =
      encodeURIComponent('companySelect') + '=' + encodeURIComponent(-1)
    document.cookie =
      encodeURIComponent('nominationSelect') + '=' + encodeURIComponent(-1)
    document.cookie =
      encodeURIComponent('statusSelect') + '=' + encodeURIComponent(-1)

    M.FormSelect.init(select1.current!)
    M.FormSelect.init(select2.current!)
    M.FormSelect.init(select3.current!)

    setFio('')

    setQs([])
    setS1("-1")
    setS2("-1")
    setS3("-1")

    //findClickHandler(true)
    
  }

  const sendWordFile = async () => {
    const resp = await $api.post('/api/get-word/', {
      // @ts-ignore
      compaing_id: companyRef2.current!.value,
      // @ts-ignore
      typeMiracle_id: nominationRef2.current!.value,
      // @ts-ignore
      VoSpo: VoSpoRef.current!.value,
    })
    window.open('/' + resp.data.url)

  }


  
  const sendExcelFile = async () => {
    const resp = await $api.post('/api/get-excel/', {
      // @ts-ignore
      compaing_id: companyRef.current!.value,
      
      // @ts-ignore
      typeMiracle_id: nominationRef.current!.value,
      
    })
    
    window.open('/' + resp.data.url)
  }
  if (!requests.length||loading) {
    return (
      <>
        <AdminHeader />
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
      <AdminHeader />
      <div className='container'>
        <h1 className='space-between'>
          Заявки
          {qs.length!==0 ?
           <small className='com-4'>{qs.filter(r => r.last_status).length} записи(ей)</small> 
          :
          <small className='com-4'>{requests.filter(r => r.status != "Черновик").length} записи(ей)</small>   
          }
        </h1>
        

        <a
          href='#excel'
          className='modal-trigger'
        >
          Скачать заявки в Excel
        </a>
        <br />
        <a
          href='#word'
          className='modal-trigger'
        >
          Скачать заявки в Word
        </a>
        <div className='row'>
          <div className=' input-field col s3'>
            <input
              id='fio'
              type='text'
              //@ts-ignore
              //disabled = {s1 !== "-1" || s2 !== "-1" || s3 !== "-1" ? true : false}
              value={fio}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>{
                setFio(event.target.value)
                
              }
              }
            />
            <label htmlFor='fio' className='com-4'>ФИО</label>
          </div>
          <div className=' col s3 input-field'>
            <select
              ref={select1}
              className='com-3'
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('companySelect') +
                  '=' +
                  encodeURIComponent(event.target.value)
                setS1(event.target.value)
              }}
            >
              <option value={-1} >Все кампании</option>
              
              {/* {//@ts-ignore
              console.log(select1.current!.value)} */}
              {companies.map(c => {
                return (
                  <option
                    value={c.id}
                    key={c.id}
                    
                    //@ts-ignore
                    
                    selected={getCookie('companySelect') === c.id.toString()} 
                  >
                    {c.name}
                  </option>
                )
              })} 
            </select>
            <label className='com-4'>Кампания</label>
          </div>
          <div className='col s3 input-field'>
            <select
              ref={select2}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('nominationSelect') +
                  '=' +
                  encodeURIComponent(event.target.value)
                setS2(event.target.value)
              }}
            >
              <option value={-1}>Все номинации</option>
              {nominations.map(n => {
                return (
                  <option
                    value={n.name}
                    key={n.name}
                    selected={getCookie('nominationSelect') === n.name}
                  >
                    {n.name}
                  </option>
                )
              })}
            </select>
            <label className='com-4'>Номинация</label>
          </div>
          <div className='col s3 input-field'>
            <select
              ref={select3}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('statusSelect') +
                  '=' +
                  encodeURIComponent(event.target.value)
                setS3(event.target.value)
              }}
            >
              <option value={-1}>Все статусы</option>
              {statuses.map(s => {
                return (
                  <option
                    value={s}
                    key={s}
                    selected={getCookie('statusSelect') === s}
                  >
                    {s}
                  </option>
                )
              })}
            </select>
            <label className='com-4'>Статус</label>
          </div>

          <div
            style={{
              float: 'right',
              display: 'flex',
              flexDirection: 'row',
              marginTop: 36,
            }}
          >
            <div className='btn-container'>
              <button
                className='waves-effect waves-light btn light-blue darken-2'
                onClick={() => findClickHandler()}
              >
                <i className='material-icons right'>search</i>Поиск
              </button>
              <button
                className='waves-effect waves-light btn red darken-4'
                style={{ marginLeft: 12 }}
                onClick={resetClickHanlder}
              >
                <i className='material-icons right'>block</i>Сбросить
              </button>
            </div>
          </div>
        </div>
      <div>
      {qs.length !== 0 ? 
      <div></div>
      :
      <Stack spacing={2}>
        <Pagination count={maxPageLimit} page={currentPage} onChange={handleChange} />
      </Stack>
      }
        <table className='com-4 striped responsive-table'>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Номинация</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Обучение</th>
              <th>Дата подачи</th>
              <th>Статус</th>
            </tr>
          </thead>

          { qs.length !== 0 ?
           <tbody>
              {qs.map(r => (
               <tr key={r.id}>
               
                 <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{`${r.student.lastname} ${r.student.firstname} ${r.student.patronymic}`}</Link></td>
                 <td><Link to={`/admin/requests/${r.id}/`} className='table-greed'>{r?.criterion?.name}</Link></td>
                 <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.institut}</Link></td>
                 <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.profile}</Link></td>
                 <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.form}</Link></td>
                 <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.CreatedOn.toLocaleString().slice(0,10)}</Link></td>
                 <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.last_status}</Link></td>
                </tr>
              ))
              }
            </tbody> 
          :
            <tbody>
              {requests.map(r => (
              
                <tr key={r.id}>
                 
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.fio}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed'>{r?.nomination?.name}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.institute}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.direction}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.educationForm}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{_(r.createdDate)}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.status}</Link></td>
                </tr>
                ))
              }
            </tbody>
          }
          
          {/* <tbody>
            {qs
            .filter(r => r.status !== "Черновик")
            .map(r => { 
                <tr key={r.id}>
                  <h3></h3>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.fio}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed'>{r?.nomination?.name}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.institute}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.direction}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.student?.educationForm}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{_(r.createdDate)}</Link></td>
                  <td><Link to={`/admin/requests/${r.id}/`} className='table-greed' >{r?.status}</Link></td>
                </tr>
})
            }
          </tbody> */}
        </table>
        </div>
      </div>


      <div id='word' className='modal'>
        <div className='modal-content'>
          <h4>Скачать заявки в Word</h4>
          
          <div className='input-field'>
            
            <select id='select-word' ref={companyRef2}>
              <option value="001" >Все кампании</option>
              {companies.map(c => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label>Кампания</label>

          </div>
          <div className='input-field'>
            <select ref={nominationRef2}>
              <option value="001" >Все критерии</option>
              {nominations.map(n => (
                <option value={n.id} key={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
            <label>Критерий</label>
          </div>

          <div className='input-field'>
            <select ref={VoSpoRef}>
              <option value="0" >ВО</option>
              <option value="1" >СПО</option>
            </select>
            <label>Уровень образования</label>
          </div>

          
          <button
            className='waves-effect waves-light btn light-blue darken-2'
            onClick={sendWordFile}
          >
            <i className='material-icons right'>download</i>Скачать
          </button>
        </div>
      </div>

      <div id='excel' className='modal'>
        <div className='modal-content'>
          <h4>Скачать заявки в Excel</h4>
          <div className='input-field' >
            <select id='excel-select' ref={companyRef}>
              <option value="001" >Все кампании</option>
              {companies.map(c => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label>Кампания</label>

          </div>
          <div className='input-field'>
            <select ref={nominationRef}>
              <option value="001" >Все критерии</option>
              {nominations.map(n => (
                <option value={n.id} key={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
            <label>Критерий</label>
          </div>
          
          <button
            className='waves-effect waves-light btn light-blue darken-2'
            onClick={sendExcelFile}
          >
            <i className='material-icons right'>download</i>Скачать
          </button>
        </div>
      </div>

      
    </>
  )
}

function getCookie(name: string): string {
  return decodeURIComponent(
    document.cookie
      .split('; ')
      .find(e => e.split('=')[0] === name)
      ?.split('=')[1]!
  )
}
