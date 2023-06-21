import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminHeader } from '../../components/Header'
import { AdminRequestPaginateContext } from '../../store/AdminRequestContext'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { AuthContext } from '../../store/AuthContext'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'
import { Link } from 'react-router-dom'
import { IRequestDetail } from '../../types/admindetailpage'
import { IInfoMiracle, IRequest } from '../../types/request'

export const AdminRequestDetailPage: FC = () => {
  const { id1 } = useParams()
  const messageRef = useRef(null)
  const btnRef = useRef(null)
  //const [loading, setLoading] = useState(false)
  const [requestDetail, setRequestDetail] = useState<IRequestDetail>();
  const {addComment, setStatus} = useContext(RequestContext)
  const { requests, count, nominations, statuses } = useContext(AdminRequestPaginateContext)

  const { fio, avatarUrl, role, id } = useContext(AuthContext)
  
  const request = requests.find(r => r.id === Number(id1))
  const [message, setMessage] = useState('')
  const _ = useFormater()
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const [achivementIdAdmin, setAchivementIdAdmin] = useState<number[]>([])
  const [files, setFiles] = useState<string>('')
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const [componentInfoAdmin, setComponentInfoAdmin] = useState<IInfoMiracle[]>([])


  const sendRequest = async (dataId: number  | undefined, score: number) => {
    const resp = await $api.post('/api/requests/set-admin-row-point/', {
        "dataId": dataId,
        "score": score,
    })
  }
  console.log(request)
  // const fetchDetailRequest = async () => {
  //   setLoading(true)
  //   const resp = await $api.get(`/api/requests/`).then((resp) => {console.log(resp.data); setLoading(false)})
    
    
  // }
  
  useEffect(() => {
    if (request?.data.data) {
        setComponentInfoAdmin(request.data.data)
    } 
    
  }, [])
  console.log(componentInfoAdmin)
  useEffect(() => {
    if (modalRef.current) {
      M.Modal.init(modalRef.current!)
    }
    

    M.FloatingActionButton.init(btnRef.current!, {
      toolbarEnabled: true,
    })

    // if (requestDetail && !isFilesLoaded) {
    //   loadFiles().then(() => setIsFilesLoaded(true))
    // }
  }, [request, isFilesLoaded])
  useEffect(() => {
    document.querySelectorAll('.tooltipped').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })
  })

  // const saveHandler = async () => {
  //   try {
  //     M.toast({
  //       html: 'Данные были успешно сохранены!',
  //       classes: 'light-blue darken-1',
  //     })
  //   } catch (e) {
  //     // M.toast({
  //     //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
  //     //   classes: 'red darken-4',
  //     // })
  //   }
  // }
  const sendHandler = () => {
    try {
      if (message.trim().length === 0)
        return M.toast({
          html: `<span>Что-то пошло не так: <b>Комментрий не должен быть пустым!</b></span>`,
          classes: 'red darken-4',
        })

      addComment(requestDetail?.id!, fio, avatarUrl, message, role, id)
      // fetchDetailRequest()
      setMessage('')
      M.toast({
        html: 'Вы успешно оставили комментарий!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }
  function formatDate(date: string) {
    let d = new Date(date);
    const formatDate = d.getDate() < 10 ? `0${d.getDate()}`:d.getDate();
    const formatMonth = d.getMonth() < 10 ? `0${d.getMonth()}`: d.getMonth();
    const formattedDate = [d.getFullYear(), formatMonth, formatDate].join('-');
    return formattedDate;
  }
 
  if (!request) {
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
      <div style={{ marginRight: 70, marginLeft: 70 }}>
        <h3 className='mt-4'>Информация о заявлении</h3>
        <table className='responsive-table'>
          <thead className='striped'>
            <tr>
              <th>Кампания</th>
              <th>Критерий</th>
              <th>Статус</th>
              <th>Дата создания</th>
              <th>Дата последнего изменения</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request.company.name}</td>
              <td>{request.nomination.name}</td>
              <td>{request.status}</td>
              <td>{_(request.createdDate)}</td>
              <td>{_(request.changedDate)}</td>
              
            </tr>
          </tbody>
        </table>
        <h3 className='mt-4'>Информация о студенте</h3>
        {/* <Link to={`/edit-application/${requestDetail?.id}`}><button className='btn light-blue darken-2'>Редактировать</button></Link> */}
        <table className='responsive-table'>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Форма обучения</th>
              <th>Источник финансирования</th>
              <th>Уровень образования</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.student?.fio}</td>
              <td>{request?.student?.phone}</td>
              <td>{request?.student?.institute}</td>
              <td>{request?.student?.direction}</td>
              <td>{request?.student?.educationForm}</td>
              <td>{request?.student?.financingSource}</td>
              <td>{request?.student?.level}</td>
              <td>{request?.student?.course}</td>
            </tr>
          </tbody>
        </table>

        <h3 className='mt-4'>Достижения</h3>
        <table className='responsive-table'>
          <thead>
            <tr>
              <th>Наименование достижения</th>
              <th>Достижение</th>
              <th>Вид достижения</th>
              <th>Уровень достиженя</th>
              <th>Статус достижения</th>
              <th>Дата меропрития</th>
              <th>Номер документа</th>
              <th>Документ</th>
              <th>Баллы</th>
            </tr>
          </thead>
          {componentInfoAdmin.map((r,index)=>{
              console.log(index)
              return (
                <tbody>
                <tr>
                  <td>{r.achivement}</td>
                  <td>{r.miracle}</td>
                  <td>{r.typeMiracle}</td>
                  <td>{r.levelMiracle}</td>
                  <td>{r.stateMiracle}</td>
                  <td>{formatDate(r.dateAchivement)}</td>
                  <td>{r.documentNumber}</td>
                  <td>
                        <div className='row'>                    
                          <div className='col s2'>
                          <a
                            key={r.dataId}
                            className='waves-effect waves-light btn light-blue darken-1 tooltipped'
                            href={r.linckDocs}
                            data-position='top'
                            data-tooltip-img={r.linckDocs}
                          >
                          <i className='material-icons'>insert_drive_file</i>
                        </a>
                          <td><small className='small'>{r.linckDocs ? r.linckDocs.substring(r.linckDocs.lastIndexOf('/') + 1) : ""}</small></td>
                        </div>
                      </div>
                    </td>
                  <td>
                    <input
                        onChange={(e: { target: { value: any } }) => {
                          const newArray = [...componentInfoAdmin]
                          newArray[index].score = e.target.value
                          setComponentInfoAdmin(newArray)
                          sendRequest(r.dataId, e.target.value)
                        }}
                        //@ts-ignore
                        value={r.score}
                        id={"point" + index}
                        placeholder={'0'}
                        type={'number'}
                    />
                  </td>
                </tr>
              </tbody>
              )
          
              })}
        </table>
        {/* <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ marginTop: 36, float: 'right' }}
          onClick={saveHandler}
        >
          <i className='material-icons left'>save</i>
          Сохранить изменения
        </button> */}
        <h3 className='mt-4'>Комментарии</h3>
        <div>
          {requestDetail?.comments?.map((c, idx) => {
            return (
              <div key={idx} className='comment'>
                <div className='avatar'>
                  {/* <img src={c.imageUrl} alt='avatar' /> */}
                  <span>{c.student ?`${c.student.lastname} ${c.student.firstname} ${c.student.patronymic}`
                    : `${c.admin.lastname} ${c.admin.firstname} ${c.admin.patronymic}`}</span>
                </div>
                <p>{c.text}</p>
                <small>{c.created_at.toLocaleString().slice(0,10)+", "+ c.created_at.toLocaleString().slice(11,16)}</small>
                {/* {console.log(c.sendedDate?.toLocaleString())} */}
              </div>
            )
          })}
        </div>
        <div className='input-field'>
          <textarea
            id='message'
            className='materialize-textarea mt-4'
            data-length='1000'
            value={message}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (message.length <= 1000) setMessage(event.target.value)
            }}
            ref={messageRef}
          ></textarea>
          <label className='message'>Сообщение</label>
        </div>
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ float: 'right' }}
          onClick={sendHandler}
        >
          <i className='material-icons left'>send</i>
          Отправить комментарий
        </button>
      </div>
      {!(
        // subRequest?.status === 'Победитель' ||
        // subRequest?.status === 'Принято' ||
        (requestDetail?.last_status === 'Удалено')
      ) ? (
        <div className='fixed-action-btn toolbar' ref={btnRef}>
          <a className='btn-floating btn-large light-blue darken-4 pulse'>
            <i className='large material-icons'>mode_edit</i>
          </a>
          <ul>
            <li>
              <a>
                <button
                  className='waves-effect waves-light yellow darken-2 btn'
                  onClick={() => {
                    try {
                      setStatus(Number(id1), 'Отправлено на доработку');
                      
                      addComment(
                        Number(id1),
                        fio,
                        avatarUrl,
                        'Статус изменён на "Отправлено на доработку"',
                        role,
                        Number(id)
                      );

                      const i = M.Modal.getInstance(modalRef.current!)
                      i.open()
                      
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Отправлено на доработку</strong> !</span>',
                        classes: 'light-blue darken-1',
                      });
                      
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Отправлено на доработку
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light light-blue darken-3 btn'
                  onClick={() => {
                    try {
                      setStatus(Number(id1), 'Принято')
                      addComment(
                        Number(id1),
                        fio,
                        avatarUrl,
                        'Статус изменён на "Принято"',
                        role,
                        Number(id)
                      )
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Принято</strong> !</span>',
                        classes: 'light-blue darken-1',
                      });
                      // fetchDetailRequest();
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Принято
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light teal darken-1 btn'
                  onClick={() => {
                    try {
                      setStatus(Number(id1), 'Получение выплаты')
                      addComment(
                        Number(id1),
                        fio,
                        avatarUrl,
                        'Статус изменён на "Получение выплаты"',
                        role,
                        Number(id)
                      )
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Получение выплаты</strong> !</span>',
                        classes: 'light-blue darken-1',
                      });
                      // fetchDetailRequest();
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Получение выплаты
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light red darken-1 btn'
                  onClick={() => {
                    try {
                      setStatus(
                        Number(id1),
                        'Отказать по решению Стипендиальной Комиссии'
                      )
                      addComment(
                        Number(id1),
                        fio,
                        avatarUrl,
                        'Статус изменён на "Отказать по решению Стипендиальной Комиссии"',
                        role,
                        Number(id)
                      )
                      
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Отказать по решению Стипендиальной Комиссии</strong> !</span>',
                        classes: 'light-blue darken-1',
                      });
                      // fetchDetailRequest();

                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Отказать по решению Стипендиальной Комиссии
                </button>
              </a>
            </li>
          </ul>
        </div>
      ) : null}
      <div style={{ height: 100 }}></div>

      {/* modal */}
      <div ref={modalRef} className='modal'>
        <div className='modal-content'>
          <h4>Оставьте комментарии</h4>
          <div style={{ height: 20 }} />
          <div className='input-field'>
            <textarea
              id='message'
              className='materialize-textarea mt-4'
              data-length='1000'
              value={message}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (message.length <= 1000) setMessage(event.target.value)
              }}
              ref={messageRef}
            ></textarea>
            <label className='message'>Сообщение</label>
          </div>
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            style={{ float: 'right' }}
            onClick={() => {
              sendHandler()
              //navigate('/admin/requests/')
            }}
          >
            <i className='material-icons left'>send</i>
            Отправить комментарий
          </button>
          <div style={{ height: 20 }} />
        </div>
      </div>
    </>
  )
}
