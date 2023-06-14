import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { AdminHeader } from '../../components/Header'
import { AdminRequestPaginateContext } from '../../store/AdminRequestContext'
import { RequestContext } from '../../store/RequestContext'
import { useFormater } from '../../hooks/useFormater'
import "../../admin.css"
import $api from '../../http'
import { Checkbox, CheckboxWithValue, FormFieldSubCriterion } from '../../components/formFieldInput'
import { setConstantValue } from 'typescript'
import axios from 'axios'


export const AdminCriterionListPage: FC = () => {
  const { addNomination, editeNomination, removeNomination } =
    useContext(RequestContext)
  const { nominations, fetchPagginatedRequests } = useContext(AdminRequestPaginateContext)
  const createModalRef = useRef(null)
  const editModalRef = useRef(null)
  const nominationRef = useRef(null)
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const inputRef3 = useRef(null)
  const inputRef4 = useRef(null)
  const inputRef5 = useRef(null)
  const _ = useFormater()
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [editData, setEditData] = useState<{
    id: undefined | string
    name: undefined | string
    docs: undefined | string
    paymentVPO: undefined | number
    paymentSPO: undefined | number
    payment_status: undefined | boolean
  }>({
    id: undefined,
    name: undefined,
    docs: undefined,
    paymentVPO: undefined,
    paymentSPO: undefined,
    payment_status: undefined,
  })
  const [subArray, setSubArray] = useState<{
    user_chose: number | undefined
    criterion: number | undefined
    id: number | undefined
    name: string
    paymentVPO: number
    paymentSPO: number
  }[]>([])
  const [checked1, setChecked1] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    docs: '',
    paymentVPO: '',
    paymentSPO: '',
    payment_status: checkboxValue,

  })
  const [loading, setLoading] = useState(true)
  const [renderCount, setRenderCount] = useState(0)
  const [componentInfo, setComponentInfo] = useState<{
    name: string
    paymentVo: number
    paymentSpo: number
  }[]>([])






  const editClickHandler = (id: string) => {
    const nomination = nominations.find(c => c.id === id)
    setEditData({
      id,
      name: nomination?.name,
      docs: nomination?.docs,
      paymentVPO: nomination?.paymentVPO,
      paymentSPO: nomination?.paymentSPO,
      payment_status: nomination?.payment_status
    })

    if (nomination === undefined) {
      setSubArray([])
    } else {
      setSubArray(nomination.sub_criterion)
    }

    const i = M.Modal.getInstance(editModalRef.current!)
    i.open()

    setTimeout(() => {
      // @ts-ignore
      inputRef1!.current.focus()
      // @ts-ignore
      inputRef2!.current.focus()
      // @ts-ignore
      inputRef3!.current.focus()
      // @ts-ignore
      inputRef4!.current.focus()
      // @ts-ignore
      inputRef4!.current.focus()
    }, 100)
  }

  const handleCheck1 = () => {
    setChecked1(!checked1);
  };

  // useEffect(() =>{
  //   // setLoading(true);
  //   fetchPaginatedRequests()
  // },[])

  useEffect(() => {
    if (!nominations.length) fetchPagginatedRequests(1)
  }, [])

  useEffect(() => {
    setRenderCount(c => ++c)

    if (renderCount === 1 || nominations.length) {
      setLoading(false)
    }
  }, [nominations])


  useEffect(() => {
    M.FormSelect.init(nominationRef.current!)
  }, [nominations.length])

  useEffect(() => {
    M.Modal.init(createModalRef.current!)
    M.Modal.init(editModalRef.current!)

  }, [loading])


  const modalEditClickHandler = () => {
    if (editData.name !== undefined && editData.paymentVPO !== undefined && editData.paymentSPO !== undefined) {
      try {
        editeNomination(
          editData.id!,
          editData.name!,
          editData.docs!,
          editData.paymentVPO,
          editData.paymentSPO,
          editData.payment_status!,
          subArray
        )
        const i = M.Modal.getInstance(editModalRef.current!)
        i.close()

        fetchPagginatedRequests(1)

        return M.toast({
          html: `<span>Критерий <b>${editData.name}</b> был успешно изменён!</span>`,
          classes: 'light-blue darken-1',
        })
      } catch (e) {

        return M.toast({
          html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
          classes: 'red darken-4',
        })
      }
    }
    M.toast({
      html: 'Зполните все поля формы!',
      classes: 'red darken-4',
    })
  }

  if (loading) {
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
    <div>
      <AdminHeader />
      <div className='container'>
        <h1>Критерии</h1>

        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Документы</th>
              <th>Оплата ВО</th>
              <th>Оплата СПО</th>
            </tr>
          </thead>
          <tbody>
            {nominations.map(n => (
              <tr key={n.id}>
                <td>{n.name}</td>
                <td>{n.docs}</td>
                <td>{n.paymentVPO}</td>
                <td>{n.paymentSPO}</td>
                <td>
                  <a
                    className='btn light-blue darken-2 waves-effect waves-light'
                    onClick={() => {
                      editClickHandler(n.id)
                      setCheckboxValue(n.payment_status)
                      const i = M.Modal.getInstance(editModalRef.current!)
                      i.open()
                    }}
                  >Редактировать
                  </a>
                </td>
                <td>
                  <a
                    className='waves-effect red darken-3 btn-small btn'
                    onClick={() => {

                      removeNomination(n.id)
                      fetchPagginatedRequests(1)
                    }}
                  >Удалить
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            float: 'right',
            marginTop: 36,
          }}
        >
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={() => {
              const i = M.Modal.getInstance(createModalRef.current!)
              i.open()
            }}
          >
            <i className='material-icons left'>add</i>
            Добавить критерий
          </button>
        </div>
      </div>

      {/* create modal */}
      <div ref={createModalRef} className='modal'>
        <div className='modal-content'>
          <h4>Добавить критерий</h4>
          <div className='input-field col s6'>
            <input
              id='name'
              type='text'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <label htmlFor='name'>Название</label>
          </div>
          <div className='input-field col s6'>
            <textarea
              id='docs'
              className='materialize-textarea'
              value={formData.docs}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  docs: e.target.value,
                }))
              }
            />
            <label htmlFor='docs'>Необходимые документы</label>
          </div>
          <div className='input-field col s6'>
            <input
              id='vpo'
              type='number'
              value={formData.paymentVPO}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  paymentVPO: e.target.value,
                }))
              }
            />
            <label htmlFor='vpo'>Выплата за ВО</label>
          </div>
          <div className='input-field col s6'>
            <input
              id='spo'
              type='number'
              value={formData.paymentSPO}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  paymentSPO: e.target.value,
                }))
              }
            />
            <label htmlFor='spo'>Выплата за СПО</label>
          </div>
          <CheckboxWithValue
            value={checkboxValue}
            label='Для коммерции'
            onChange={(e: any) => {
              setCheckboxValue(e.target.checked)
              setFormData(prev => ({
                ...prev,
                payment_status: e.target.checked
              }))
            }}

          />

          <div style={{ margin: '2.5% 0%' }} >
            <h6>Подкритерии</h6>
          </div>
          <div>

            {

              componentInfo.map((element, index) => {
                return (

                  <FormFieldSubCriterion
                    onClickDelete={() => {
                      const newArray = [...componentInfo]
                      newArray.splice(index, 1)
                      setComponentInfo(newArray)
                    }}
                    onChangeName={(e: { target: { value: any } }) => {
                      const newArray = [...componentInfo]
                      newArray[index].name = e.target.value
                      setComponentInfo(newArray)
                    }}
                    onChangePaymentVo={(e: { target: { value: any } }) => {
                      const newArray = [...componentInfo]
                      newArray[index].paymentVo = e.target.value
                      setComponentInfo(newArray)
                    }}

                    onChangePaymentSpo={(e: { target: { value: any } }) => {
                      const newArray = [...componentInfo]
                      newArray[index].paymentSpo = e.target.value

                      setComponentInfo(newArray)
                    }}
                    name={element.name}
                    paymentVo={element.paymentVo}
                    paymentSpo={element.paymentSpo}

                  />)
              }
              )
            }

          </div>

          <div style={{
            margin: "2.5% 0%"
          }} >
            <button className='btn light-blue darken-2 waves-effect waves-light'
              onClick={() => {
                setComponentInfo(oldArray => [...oldArray, { name: '', paymentVo: 0, paymentSpo: 0 }])
              }}

            >
              <i className='material-icons left'>add</i>
              Добавить подкритерий
            </button>
          </div>
        </div>
        <div className='modal-footer'>
          <button

            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={() => {
              addNomination(
                formData.id,
                formData.name,
                formData.docs,
                Number(formData.paymentVPO),
                Number(formData.paymentSPO),
                formData.payment_status,
                componentInfo,
              )
              fetchPagginatedRequests(1)
            }
            }
          >
            <i className='material-icons left'>save</i>
            Добавить критерий
          </button>
        </div>
      </div>

      {/* edit modal */}
      <div ref={editModalRef} className='modal'>
        <div className='modal-content'>
          <h4>
            Изменить критерий <strong>{editData.name}</strong>
          </h4>
          <div className='input-field' style={{ marginTop: 16 }}>
            <input
              id='name'
              type='text'
              value={editData.name}
              ref={inputRef1}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEditData(prev => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
            <label htmlFor='name'>Название</label>
          </div>
          <div className='input-field'>
            <input
              type='text'
              id='docs'
              value={editData.docs}
              ref={inputRef2}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEditData(prev => ({
                  ...prev,
                  docs: event.target.value,
                }))
              }
            />
            <label htmlFor='docs'>Необходимые документы</label>
          </div>
          <div className='input-field'>
            <input
              type='number'
              id='vpo'
              value={editData.paymentVPO}
              ref={inputRef3}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEditData(prev => ({
                  ...prev,
                  paymentVPO: Number(event.target.value),
                }))
              }
            />
            <label htmlFor='vpo'>Выплата ВО</label>
          </div>
          <div className='input-field'>
            <input
              type='number'
              id='spo'
              value={editData.paymentSPO}
              ref={inputRef4}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEditData(prev => ({
                  ...prev,
                  paymentSPO: Number(event.target.value),
                }))
              }
            />
            <label htmlFor='spo'>Выплата СПО</label>
          </div>


          <CheckboxWithValue
            value={checkboxValue}
            label='Для коммерции'
            onChange={(e: any) => {
              setCheckboxValue(e.target.checked)
              setEditData(prev => ({
                ...prev,
                payment_status: e.target.checked
              }))
            }}

          />

          <div>

            {

              subArray.map((element, index) => {
                return (

                  <FormFieldSubCriterion
                    onClickDelete={() => {
                      const newArray = [...subArray]
                      newArray.splice(index, 1)
                      setSubArray(newArray)
                    }}
                    onChangeName={(e: { target: { value: any } }) => {
                      const newArray = [...subArray]
                      newArray[index].name = e.target.value
                      setSubArray(newArray)
                    }}
                    onChangePaymentVo={(e: { target: { value: any } }) => {
                      const newArray = [...subArray]
                      newArray[index].paymentVPO = e.target.value
                      setSubArray(newArray)
                    }}

                    onChangePaymentSpo={(e: { target: { value: any } }) => {
                      const newArray = [...subArray]
                      newArray[index].paymentSPO = e.target.value

                      setSubArray(newArray)
                    }}
                    name={element.name}
                    paymentVo={element.paymentVPO}
                    paymentSpo={element.paymentSPO}

                  />)
              }
              )
            }

          </div>

          <div style={{
            margin: "2.5% 0%"
          }} >
            <button className='btn light-blue darken-2 waves-effect waves-light'
              onClick={() => {
                setSubArray(oldArray => [...oldArray, { name: '', paymentVPO: 0, paymentSPO: 0, criterion: undefined, id: undefined, user_chose: undefined }])
              }}

            >
              <i className='material-icons left'>add</i>
              Добавить подкритерий
            </button>
          </div>

          <div className='modal-footer'>
            <button
              className='btn light-blue darken-2 waves-effect waves-light'
              onClick={modalEditClickHandler}
            >
              <i className='material-icons left'>save</i>
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
