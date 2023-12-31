import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import MediaQuery from "react-responsive"
import { useParams, useNavigate } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import { CompanyContext } from '../../store/CompanyContext'
import { FormFieldTableRow } from '../../components/achievementTableRow'

import { AuthContext } from '../../store/AuthContext'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import "../../index.css"
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'
import { bottom, end, eventListeners } from '@popperjs/core'
import axios from 'axios'
import { IInfoMiracle, IRequest } from '../../types/request'


export const StudentRequestDetailPage: FC = () => {
  const { id1 } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const achivementRef = useRef(null)
  const _ = useFormater()
  const navigate = useNavigate()

  const { requests, fetchRequests, addComment, setStatus } = useContext(RequestContext)
  const { nominations } = useContext(CompanyContext)
  const { fio, avatarUrl, role, id } = useContext(AuthContext)

  const request: IRequest = requests.filter(r => r.id === Number(id1))[0]

  const [achivementId, setAchivementId] = useState<number[]>([])
  const [achivementFileLink, setAchivementFileLink] = useState<string[]>([])
  const [achivementState, setAchivementState] = useState<Array<{
    typeAchivement: [],
    stateAchivement: [],
    levelAchivement: [],
    dictProgress: Number,

  }>>([])


  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<{ id: number; linkDocs: string, dateOn: Date }[]>([])
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const [componentInfo, setComponentInfo] = useState<IInfoMiracle[]>([])

  const deleteRow = async (bodyId: number) => {
    const resp = await $api.post('/api/requests/remove-data/',
      { 'id': id1, "bodyId": bodyId })
  }

  const addRow = async (index: number) => {
    const resp = await $api.post('/api/requests/add-row/',
      { 'id': id1 })
    setAchivementId(oldArray => [...oldArray, resp.data.id])
  }

  const setImage = async (formData: FormData, index: number) => {

    const resp = await $api.post('/api/set-image/', formData).then((resp) => {
      const newArray = [...achivementFileLink]
      newArray[index] = resp?.data?.url
      setAchivementFileLink(newArray)
    })

  }

  const sendRequest = async () => {
    const resp = await $api.post('/api/requests/save/', {
      "componentInfo": componentInfo,
      "achivementId": achivementId,
      "achivementFileLink": achivementFileLink,
      "id": id1
    })
  }

  //@ts-ignore
  const achivement = request?.nomination?.progress['progress']

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const newArrayInfo = [...componentInfo]
    newArrayInfo[index].miracle = event.target.value
    setComponentInfo(newArrayInfo)

    //@ts-ignore
    const testAchivement = request?.nomination?.progress['progress'].filter(r => r.name === event.target.value)
    const newArray = [...achivementState]

    newArray.push({
      "dictProgress": testAchivement[0].id,
      //@ts-ignore
      "levelAchivement": request?.nomination.levelProgress['level'].filter(r => r['dictprogress'] === testAchivement[0].id),
      //@ts-ignore
      "stateAchivement": request?.nomination.statusProgress['statusProgress'].filter(r => r['dictprogress'] === testAchivement[0].id),
      //@ts-ignore
      "typeAchivement": request?.nomination.viewProgress['viewProgress'].filter(r => r['dictprogress'] === testAchivement[0].id),

    })
    setAchivementState(newArray)
  }

  function formatDate(date: string) {
    let d = new Date(date);
    const formatDate = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    const formatMonth = d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth();
    const formattedDate = [d.getFullYear(), formatMonth, formatDate].join('-');
    return formattedDate;
  }
  console.log(achivementFileLink)
  useEffect(() => {
    if (request.data) {
      setComponentInfo(request.data.data)
      request.data.data.map((element) => {

        //@ts-ignore
        const testAchivement = request?.nomination?.progress['progress'].filter(r => r.name === element.miracle)
        const newArray = [...achivementState]

        newArray.push({
          "dictProgress": testAchivement[0]?.id,
          //@ts-ignore
          "levelAchivement": request?.nomination?.levelProgress['level'].filter(r => r['dictprogress'] === testAchivement[0]?.id),
          //@ts-ignore
          "stateAchivement": request?.nomination?.statusProgress['statusProgress'].filter(r => r['dictprogress'] === testAchivement[0]?.id),
          //@ts-ignore
          "typeAchivement": request?.nomination?.viewProgress['viewProgress'].filter(r => r['dictprogress'] === testAchivement[0]?.id),

        })
        setAchivementState(newArray)
        setAchivementFileLink(oldArray => [...oldArray, element?.linckDocs])
        setAchivementId(oldIdArray => [...oldIdArray, element?.dataId])
      })

    }
  }, [])

  useEffect(() => {
    document.querySelectorAll('.tooltipped').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })
  })

  const sendHandler = () => {
    try {
      if (message.trim().length === 0)
        return M.toast({
          html: `<span>Что-то пошло не так: <b>Комментрий не должен быть пустым!</b></span>`,
          classes: 'red darken-4 position',
        })

      addComment(request?.id!, fio, avatarUrl, message, role, id)
      setMessage('')
      M.toast({
        html: 'Вы успешно оставили комментарий!',
        classes: 'light-blue darken-2 position',
      })
    } catch (e) {
      M.toast({
        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
        classes: 'red darken-4',
      })
    }
  }

  console.log(componentInfo)
  if (!request && isFilesLoaded) {
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


  const endDate = new Date(Date.parse(String(request?.company.endDate)))
  const statusApplication = (request?.status == "Черновик" || request?.status == "Отправлено на доработку") && endDate != undefined && endDate > new Date();

  return (
    <>

      <StudentHeader />
      <div style={{ alignSelf: "center" }} className='container' >
        <MediaQuery minWidth={120}>
          <h3 className='mt-4'>Информация о заявлении</h3>
          <table className='responsive-table com-4'>
            <thead>
              <tr>
                <th>Кампания</th>
                <th>Номинация</th>
                <th>Статус</th>
                <th>Дата создания</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{request?.company.name}</td>
                <td>{request?.nomination.name}</td>
                <td>{request?.status}</td>
                <td>{_(request?.createdDate)}</td>
              </tr>
            </tbody>
          </table>
        </MediaQuery>
        <MediaQuery minWidth={120}>
          <h3 className='mt-4'>Информация о студенте</h3>
          <table className='responsive-table table-width com-4'>
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
            <tbody >
              <tr>
                <td>{request?.student.fio}</td>
                <td>{request?.student.phone}</td>
                <td >{request?.student.institute}</td>
                <td>{request?.student.direction}</td>
                <td>{request?.student.educationForm}</td>
                <td>{request?.student.financingSource}</td>
                <td>{request?.student.level}</td>
                <td>{request?.student.course}</td>
              </tr>
            </tbody>
          </table>


        </MediaQuery>
        <MediaQuery minWidth={120}>
          <div style={{ boxShadow: "0px 0px 0px 0px" }}>
            <h3 className='mt-4'>Достижения
              {request.status === "Черновик" || request.status === "Отправлено на доработку" ?
                <><button
                  style={{ float: "right", marginTop: "0.9em" }}
                  onClick={() => {
                    setComponentInfo(oldArray => [...oldArray, {
                      'achivement': "",
                      'miracle': "",
                      'typeMiracle': "",
                      'levelMiracle': "",
                      'stateMiracle': "",
                      'dateAchivement': '',
                      'documentNumber': 0,
                      'document': null,
                      "documentTitle": "",
                      'score': 0,
                      'linckDocs': "",
                      'dataId': 0
                    }])
                    addRow(componentInfo.length)


                  }}
                  className='btn light-blue darken-2 waves-effect waves-light center-btn com-4'>
                  Добавить достижение
                </button>
                  <button
                    className='btn light-blue darken-2 waves-effect waves-light center-btn com-4'
                    style={{ float: "right",  marginTop: "0.9em", marginRight: "1em" }}
                    onClick={() => {
                      sendRequest()
                    }}
                    >
                    Сохранить изменения
                  </button></>
                :
                <div></div>
              }


            </h3>

          </div>
          <table className='responsive-table table-width com-4'>
            <thead>
              <tr>
                <th>Наименование достижения</th>
                <th style={{ width: "12%" }} >Достижение</th>
                <th>Вид достижения</th>
                <th>Уровень достижения</th>
                <th>Статус достижения</th>
                <th>Дата мероприятия</th>
                <th style={{ width: "10%" }} >Номер документа</th>
                <th style={{ width: "15%" }} >Документ</th>
                <th style={{ width: "2%" }} >Баллы</th>
              </tr>
            </thead>
            <tbody>
              {request.status === "Черновик" || request.status === "Отправлено на доработку" ?

                componentInfo.map((element, index) => {
                  return (
                    <FormFieldTableRow
                      achivement={element.achivement}
                      documentNumber={element.documentNumber}
                      score={element.score}
                      dateAchivement={formatDate(element.dateAchivement)}
                      miracle={achivement}
                      miracleAchivement={element.miracle}
                      achivementmainState={achivementState}
                      selectChange={selectChange}
                      index={index}
                      typeMiracle={element.typeMiracle}
                      levelMiracle={element.levelMiracle}
                      stateMiracle={element.stateMiracle}
                      documentTitle={element.documentTitle}
                      requestStatus={request.status}
                      linckDocs={element.linckDocs}

                      onClickDelete={() => {
                        const newArray = [...componentInfo]
                        const removed = newArray.splice(index, 1)
                        setComponentInfo(newArray)

                        const newArrayId = [...achivementId]
                        newArrayId.splice(index, 1)
                        setAchivementId(newArrayId)

                        const achivementArray = [...achivementState]
                        achivementArray.splice(index, 1)
                        setAchivementState(achivementArray);

                        const achivementFile = [...achivementFileLink]
                        achivementFile.splice(index, 1)
                        setAchivementFileLink(achivementFile);
                        { element.dataId ? deleteRow(element.dataId) : deleteRow(achivementId[index]) }

                      }}

                      onChangeDocumentNumber={(e: { target: { value: any } }) => {
                        const newArray = [...componentInfo]
                        newArray[index].documentNumber = e.target.value
                        setComponentInfo(newArray)
                      }}

                      onChangeAchivement={(e: { target: { value: any } }) => {
                        const newArray = [...componentInfo]
                        newArray[index].achivement = e.target.value
                        setComponentInfo(newArray)
                      }}

                      onChangeScore={(e: { target: { value: any } }) => {
                        const newArray = [...componentInfo]
                        newArray[index].score = e.target.value
                        setComponentInfo(newArray)
                      }}

                      onChangeDate={(e: { target: { value: any } }) => {
                        console.log(index)
                        const newArray = [...componentInfo]
                        newArray[index].dateAchivement = formatDate(e.target.value)
                        setComponentInfo(newArray)
                      }}

                      onChangeMiracle={(e: { target: { value: any } }) => {

                        const newArray = [...componentInfo]
                        newArray[index].miracle = e.target.value
                        setComponentInfo(newArray)
                      }}

                      onChangeTypeMiracle={(e: { target: { value: any } }) => {
                        const newArray = [...componentInfo]
                        newArray[index].typeMiracle = e.target.value
                        setComponentInfo(newArray)
                      }}

                      onChangeLevelMiracle={(e: { target: { value: any } }) => {
                        const newArray = [...componentInfo]
                        newArray[index].levelMiracle = e.target.value
                        setComponentInfo(newArray)
                      }}

                      onChangeStateMiracle={(e: { target: { value: any } }) => {
                        const newArray = [...componentInfo]
                        newArray[index].stateMiracle = e.target.value
                        setComponentInfo(newArray)
                      }}

                      onChangeFile={async (
                        e: { target: { files: any } }
                      ) => {
                        try {
                          console.log(index)
                          const fd = new FormData()
                          const file = e.target.files![0]
                          fd.append('image', file as File, file.name)
                          const newArray = [...componentInfo]
                          newArray[index].document = file
                          newArray[index].documentTitle = file.name
                          setComponentInfo(newArray);
                          setImage(fd, index)

                        } catch (e) {
                          M.toast({
                            html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                            classes: 'red darken-4',
                          })
                        }
                      }}


                    />)
                }
                )
                :
                componentInfo.map((element, index) => {
                  return (
                    <tr>
                      <td>{element.achivement}</td>
                      <td>{element.miracle}</td>
                      <td>{element.typeMiracle}</td>
                      <td>{element.levelMiracle}</td>
                      <td>{element.stateMiracle}</td>
                      <td>{formatDate(element.dateAchivement)}</td>
                      <td>{element.documentNumber}</td>
                      <td>
                        <div className='row'>
                          <div className='col s2'>
                            <a
                              key={element.dataId}
                              className='waves-effect waves-light btn light-blue darken-1 tooltipped'
                              href={element.linckDocs}
                              data-position='top'
                              data-tooltip-img={element.linckDocs}
                            >
                              <i className='material-icons'>insert_drive_file</i>
                            </a>
                            <td><small className='small'>{element.linckDocs ? element.linckDocs.substring(element.linckDocs.lastIndexOf('/') + 1) : ""}</small></td>
                          </div>
                        </div>
                      </td>
                      <td>
                        {element.score}
                      </td>
                    </tr>
                  )
                })
              }

              {/* <FormFieldTableRow/> */}
              {/* <tr>
                <td> */}
              {/* <div className='row'>
                    {files.map(f => (
                      <>
                        <div className='col s2' style={{ position: 'relative' }}>
                                                    <td>
                              <small className='small' >{formatDate(f.dateOn).toLocaleString()}</small>
                              
                            </td>
                            
                          <a

                            key={f.id}
                            className='waves-effect waves-light btn light-blue darken-1 tooltipped '
                            href={f.linkDocs}
                            data-position='top'
                            data-tooltip-img={f.linkDocs}
                          >
                            <i className='material-icons'>insert_drive_file</i>

                          </a>
                            
                          <a
                            className='btn-floating btn-large waves-effect waves-light red darken-1 btn-small'
                            style={{
                              position: 'absolute',
                              bottom: -16.2,
                              left: 0,
                            }}
                            

                            onClick={async event => {
                              event.preventDefault()
                              if (request?.status == 'Черновик') {
                                $api.delete('/api/set-image/', {
                                  data: {
                                    id: request!.id,
                                    fileId: f.id,
                                  },
                                })
                                
                                setFiles(prev =>
                                  prev.filter(prevFile => prevFile.id !== f.id)
                                )
                              }
                              if (request?.status == "Отправлено на доработку") {
                                $api.delete('/api/set-image/', {
                                  data: {
                                    id: request!.id,
                                    fileId: f.id,
                                  },
                                })

                                setFiles(prev =>
                                  prev.filter(prevFile => prevFile.id !== f.id)
                                )
                              }
                            }}
                          >
                            <i className='material-icons'>close</i>
                          </a>
                          <td><small className='small' >{f.linkDocs.substring(f.linkDocs.lastIndexOf('/') + 1)}</small></td>
                        </div>
                        
                      </>
                    ))}
                    
                  </div> */}

              {/* </td>

              </tr> */}
            </tbody>
          </table>
          {/* {request?.status === 'Черновик' ||
            request?.status === 'Отправлено на доработку' ? (
            <div
              className='button-input-container'
              style={{
                float: 'right',
              }}
            >
              <div className='file-field input-field'>
                <div className='btn light-blue darken-2' style={{ width: "80%" }} >
                  <label className='add-label com-4' htmlFor="files">Добавить файл</label>
                  <input
                    className='hidden-input'
                    id="files"
                    type='file'
                    onChange={async (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      try {

                        const file = event.target.files![0]
                        fileImageSet(file)
                        fileNameInputSet(file.name)

                      } catch (e) {
                        // M.toast({
                        //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        //   classes: 'red darken-4',
                        // })
                      }
                    }}
                  />

                  <input
                    id="fileName"

                    value={fileNameInput}
                    onChange={(e) => fileNameInputSet(e.target.value)}
                  />
                  <div>
                    <button
                      className="btn light-blue darken-2 com-4"
                      onClick={async () => {
                        console.log(typeof (fileNameInput))
                        if (fileNameInput.indexOf('.pdf') !== -1 || fileNameInput.indexOf('.jpeg') !== -1 || fileNameInput.indexOf('.png') !== -1 || fileNameInput.indexOf('.jpg') !== -1 || fileNameInput.indexOf('.heic') !== -1) {
                          const fd = new FormData()

                          fd.append('image', fileIamge as File, fileNameInput)
                          fd.append('request', request.id.toString())
                          const resp = await $api.post('/api/set-image/', fd)

                          if (resp.status === 201) {
                            fileImageSet(null)
                            fileNameInputSet('')
                          } else {
                            alert('Что-то пошло не так!')
                          }

                          document.querySelectorAll('.tooltipped').forEach(el => {
                            const url = el.getAttribute('data-tooltip-img')
                            M.Tooltip.init(el, {
                              html: `<img src="${url}" class="tooltip-img" />`,
                            })
                          })

                          setFiles
                            (prev => [...prev, resp.data])

                        } else {
                          alert('Не указано расширение файла (pdf, png, jpg, jpeg, heic)')
                        }

                      }

                      }
                      type="submit"
                      name="action"
                    >Сохранить
                    </button>
                    <h6 className='required-files com-4' id='file-warning' >Обязательно переименуйте файл!</h6>
                  </div>


                </div>
                <div className='file-path-wrapper'>
                  <input className='file-path validate' type='text' />
                </div>
              </div>
            </div>
          ) : null} */}

        </MediaQuery>

        <br />
        <h3 className='mt-4'>Комментарии</h3>
        <div style={{
          margin: "5% 0% "
        }} >
          {request?.comments.map((c, idx) => {
            return (
              <div key={idx} className='comment'>
                <div className='avatar'>
                  <span>{c.name}</span>
                </div>
                <p className='com-3'>{c.text}</p>

                <small>{c.sendedDate.toLocaleString()}</small>

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
          <label className='message com-4'>Сообщение</label>
        </div>

        <button
          className='btn light-blue darken-2 waves-effect waves-light center-btn com-4'
          style={{ float: 'right' }}
          onClick={sendHandler}
        >Отправить комментарий
          <i className='material-icons right'>send</i>

        </button>

        {(statusApplication) ?
          <div className='displayed'>
            <button
              style={{ float: 'right' }}
              className='btn light-blue darken-2 waves-effect waves-light left com-4'
              onClick={() => {
                try {
                  setStatus(request?.id!, 'Отправлено на рассмотрение')
                  addComment(
                    request?.id!,
                    fio,
                    avatarUrl,
                    'Статус изменён на "Отправлено на рассмотрение"',
                    role,
                    id
                  )
                  sendRequest()
                  M.toast({
                    html: '<span>Вы успешно выставили статус <strong>Отправлено на рассмотрение</strong> !</span>',
                    classes: 'light-blue darken-2 position',
                  })
                } catch (e) {
                  M.toast({
                    html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                    classes: 'red darken-4 position',
                  })
                }
              }}
            >
              Отправить на рассмотрение
            </button>

          </div>

          : <div></div>
        }
 
        <div style={{ height: 100 }}></div>



      </div>

    </>
  )
}
