import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { StudentHeader } from '../../components/Header'
import { CompanyContext } from '../../store/CompanyContext'
import { Checkbox } from '../../components/formFieldInput'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import M from 'materialize-css'
import { Link, useParams } from 'react-router-dom'
import { useFormater } from '../../hooks/useFormater'
import { NotificationContext } from '../../store/NotificationContext'
import $api from '../../http'
import "../../admin.css"
import { ICompany } from '../../types/companies'

export const StudentCompanyListPage: FC = () => {
  const { companies, fetchCompanies, nominations } = useContext(CompanyContext)
  const { requests, fetchRequests, addRequest } = useContext(RequestContext)
  const { notifications, fetchNotifications, clearNotifications } =
    useContext(NotificationContext)
  const createModalRef = useRef(null)
  const params = useParams()
  const nominationRef = useRef(null)
  const companiesRef = useRef(null)
  const subNominationRef = useRef(null)
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const { id, financingSource } = useContext(AuthContext)
  const [state, setState] = useState({ nominationRef: '' })
  const [loading, setLoading] = useState(true)
  const qs = requests.filter(r => r.company.id === Number(params.id))
  //@ts-ignore 
  const [company, setCompany] = useState()
  const _ = useFormater()

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //@ts-ignore
    setCompany(companies.filter(r => r.id === Number(companiesRef?.current?.value)));
    if (company !== undefined)
      console.log(company[0])
  };
  console.log(nominations)

  const [subArray, setSubArray] = useState<{
    user_chose: number
    criterion: number
    id: number
    name: string
    paymentVPO: number
    paymentSPO: number
  }[]>([])

  const handleCheck1 = () => {
    setChecked1(!checked1);
  };
  const handleCheck2 = () => {
    setChecked2(!checked2);
  };
  const handleCheck3 = () => {
    setChecked3(!checked3);
  };

  // console.log(nominations)
  useEffect(() => {
    if (!companies.length) fetchCompanies()
    if (!requests.length) fetchRequests()
    if (!notifications.length) fetchNotifications()
  }, [])

  useEffect(() => {
    M.Modal.init(createModalRef.current!)
    //M.FormSelect.init(nominationRef.current!)
  }, [companies, requests])




  useEffect(() => {
    if (notifications.length) {
      if (notifications[0].id === -1) {
        clearNotifications()
      }
      setLoading(false)
    }
  }, [notifications])


  if (loading) {
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
        <div className='toast light-blue darken-2'>
          В случае возникновения технических проблем с сайтом, просьба писать на it@kantiana.ru
        </div>

        {notifications.map(n => (
          <div className='toast light-blue darken-2' key={n.id}>
            {n.text}

          </div>
        ))}

        <br />

        <h4>Выберите кампанию из списка для продолжения</h4>


        <select onChange={selectChange} ref={companiesRef} style={{ display: 'block' }} className='com-3'>
          <option selected >--Выберите--</option>
          {companies.map(comp => (

            <option value={comp.id} key={comp.id}>{comp.name}-начало-{_(comp.startDate)}-конец-{_(comp.endDate)}</option>
          ))}


        </select>

        <h4>Выберите критерий из списка для продолжения</h4>

        <select className='com-3'      
          ref={nominationRef}
          style={{ display: "block" }}>


          <option>--Выберите--</option>
          {nominations.filter(n => {
            if (financingSource === 'Полное возмещение затрат') {

              const studentFinanceSource = financingSource === 'Полное возмещение затрат'

              return !(qs.map(r => r.nomination.name).indexOf(n.name) + 1) && studentFinanceSource
            } else {
              return !(qs.map(r => r.nomination.name).indexOf(n.name) + 1)

            }

          }


          ).map(n => (

            <option value={n.id} key={n.id}>
              {n.name}
            </option>
          ))
          }

        </select>
        {/* {subArray.length !==0 ?
            <div>
               <h4>Выберите подкритерий из списка для продолжения</h4>
                <select className='com-3' ref={subNominationRef} style={{display: 'block'}}>
                  {subArray.map(sub => (
                    <option value={sub.id} key={sub.id}>{sub.name}</option>
                  ))}

                </select>

            </div> 
            : <div></div>

        } */}
        <div className='div-checkbox' style={{
          margin: "2% 0%",
          float: 'left'
        }}>
          <span className='com-4'>Подавая заявку, вы подтверждаете следующее:</span>
          <br />
          <Checkbox
            label="Даю согласие в установленном Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» порядке на обработку и использование моих персональных данных "
            onChange={handleCheck1}
          />
          <br />
          <br />

          <Checkbox
            label='Предупрежден об ответственности за представление заведомо ложных и (или) недостоверных сведений, а равно путем умолчания о фактах, влекущих прекращение указанных выплат, в соответствии со ст. 159.2. УК РФ от 13.06.1996 N 63-ФЗ (ред. от 18.02.2020)'
            onChange={handleCheck2}
          />
          <br />
          <br />

          <Checkbox
            label='Обязуюсь предоставить оригиналы прилагаемых документов по запросу сотрудника Центра социально-экономической поддержки студентов в течение 10 рабочих дней с момента поступления запроса в мой личный кабинет. Уведомлен, что в случае непредставления информации заявка аннулируется'
            onChange={handleCheck3}
          />

          <div style={{ float: 'left', marginTop: 36, }}>
            <button className='btn light-blue darken-2 waves-effect waves-light'

              onClick={() => {
                //@ts-ignore
                if (company[0]?.endDate !== undefined && company[0]?.endDate < new Date()) {
                  alert('Кампания окончена!')


                }//@ts-ignore
                else if (checked1 && checked2 && checked3 == true) {

                  //@ts-ignore
                  if (nominationRef?.current?.value === "--Выберите--") {
                    M.toast({
                      html: 'Вы не выбрали критерий',
                      classes: 'red darken-4 position',

                    })

                  }
                  else {
                    //@ts-ignore
                    const nom = nominationRef?.current?.value
                    //@ts-ignore
                    addRequest(companiesRef?.current?.value, nom)
                    M.toast({
                      html: 'Вы успешно добавили заявку',
                      classes: 'light-green darken-2 position',

                    })
                  }
                } else {
                  alert('Вы не отметили обязательные поля!')
                }

              }} ><i className='material-icons left'>save</i>
              Добавить заявку
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function getSelectValues(select: HTMLSelectElement) {
  var result = []
  var options = select && select.options
  var opt

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i]

    if (opt.selected) {
      result.push(opt.value || opt.text)
    }
  }
  return result
}
