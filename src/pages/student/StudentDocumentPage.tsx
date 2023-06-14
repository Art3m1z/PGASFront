import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import MediaQuery from "react-responsive"
import { useParams, useNavigate } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import { CompanyContext } from '../../store/CompanyContext'

import { AuthContext } from '../../store/AuthContext'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import "../../index.css"
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'
import { bottom, end } from '@popperjs/core'


export const StudentDocumentPage: FC = () => {
  const { id1 } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const { requests, fetchRequests, addComment, setStatus } = useContext(RequestContext)
  const { fio, avatarUrl, role, id } = useContext(AuthContext)
const request = requests.find(r => r.id === Number(id1))
//const request = requests.find((element) => element.id === parseInt(String(id), 10))
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<{ id: number; linkDocs: string, dateOn: Date }[]>([])
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)


  const [fileIamge, fileImageSet] = useState<File|null>()

  const [fileNameInput, fileNameInputSet] = useState('')
  const _ = useFormater()
  const navigate = useNavigate()


  const loadFiles = async () => {
    const resp = await $api.get('/api/requests-files/get/?pk=' + request?.id)
    setFiles(resp.data)
    
  }
  

  useEffect(() => {
    // @ts-ignore
    if (pointRef.current) pointRef.current.focus()
    M.CharacterCounter.init(messageRef.current!)

    if (request && !isFilesLoaded) {
      loadFiles().then(() => setIsFilesLoaded(true))
    }
  }, [request, isFilesLoaded])

  useEffect(() => {
    document.querySelectorAll('.tooltipped').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })
  })


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

  function formatDate(date: string | number | Date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');;
  }
  
  const endDate = new Date(Date.parse(String(request?.company.endDate)))
  const statusApplication =  (request?.status == "Черновик" || request?.status == "Отправлено на доработку") && endDate != undefined  && endDate > new Date();
  
  return (
    <>
    
      <StudentHeader />      
      <div style={{ marginRight: 70, marginLeft: 70 }}>
        <Link   to={`/requests/${request?.id}`}>
          <button className=' pos btn light-blue darken-2 waves-effect waves-light '><i className='material-icons'>arrow_back</i></button>
        </Link>
        <h3 className='mt-4'>Приложения к заявлению</h3>
        <table className=''>
          <thead>
            <tr>
              <th>Документы к заявлению</th>
              <th><h6 className='required-files' >ОБЯЗАТЕЛЬНО ПРИКРЕПИТЬ! Паспорт: 2-3 стр, прописку, семейное положение по паспорту, ИНН, СНИЛС</h6></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              
              <td>
                <div className='row'>
                  {files.map(f => (
                    <>
                      <div className='col s2' style={{ position: 'relative' }}>
                                                  <td>
                            <small className='small' >{formatDate(f.dateOn).toLocaleString()}</small>
                            
                          </td>
                          
                        <a

                          key={f.id}
                          className='waves-effect waves-light btn light-blue darken-1 tooltipped  center-img'
                          href={f.linkDocs}
                          data-position='top'
                          data-tooltip-img={f.linkDocs}
                        >
                          <i className='material-icons center-img'>insert_drive_file</i>

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
                  
                </div>
                
              </td>
              
            </tr>
          </tbody>
        </table>
        {request?.status === 'Черновик' ||
          request?.status === 'Отправлено на доработку' ? (
          <div
            className='button-input-container'
            style={{
              float: 'right',
            }}
          >
            <div className='file-field input-field'>
            <h6 className='required-files com-4' id='file-warning' >Обязательно переименуйте файл!</h6>
              <div className='btn light-blue darken-2' style={{width:"80%"}} >
              
                <label className='add-label'   htmlFor="files">Добавить файл</label>
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
                     onClick={ async () =>  {
                      console.log(typeof(fileNameInput))
                      if (fileNameInput.indexOf('.pdf') !== -1 || fileNameInput.indexOf('.jpeg') !== -1 || fileNameInput.indexOf('.png') !== -1 || fileNameInput.indexOf('.jpg') !== -1 || fileNameInput.indexOf('.heic') !== -1) {
                        const fd = new FormData()

                      fd.append('image', fileIamge as File, fileNameInput)
                      fd.append('request', request.id.toString())
                      const resp = await $api.post('/api/set-image/', fd)

                      if (resp.status === 201){
                        fileImageSet(null)
                        fileNameInputSet('')
                      }else{
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
                 
                </div>
                
                
              </div>
              <div className='file-path-wrapper'>
                <input className='file-path validate' type='text' />
              </div>
            </div>
          </div>
        ) : null}
        
      </div>
      
    </>
  )
}
