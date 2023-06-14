import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import '../../index.css'

import { AdminRequestPaginateContext } from '../../store/AdminRequestContext'
import { AuthContext } from '../../store/AuthContext'
import $api from '../../http'
import { FormFieldInput } from '../../components/formFieldInput'
import { IRequestDetail } from '../../types/admindetailpage'


export const AdminEditePage: FC = () => {
    const [ request, setRequest] = useState<{
        student: {
            id: number
            phone: undefined| string
            INN: undefined| string
            SNILS: undefined | string
            passport_seria: undefined|string
            passport_number: undefined|string
            institut: undefined | string
            profile: undefined | string
            form : undefined | string
            address: string | undefined
            factaddress: string | undefined
          }
    }>()
    const { id } = useParams()
    //@ts-ignore
   // const request = requests.find((element) => element.id === parseInt(String(id), 10))

    const [fio, setFio] = useState(request?.student.fio)
    const [phone, setPhone] = useState(request?.student?.phone)
    const [institute, setInstitute] = useState(request?.student.institut)
    const [direction, setDirection] = useState(request?.student.profile)
    const [educationForm, setEducationForm] = useState(request?.student.form)
    //const [financingSource, setFinancingSource] = useState(request?.student.source_finance)
    //const [level, setLevel] = useState(request?.student.level)
    //const [course, setCourse] = useState(request?.student.course)
    const [INN, setINN] = useState(request?.student.INN)
    const [SNILS, setSNILS] = useState(request?.student.SNILS)
    const [address, setAddress] = useState(request?.student.address)
    const [factaddress, setFactaddress] = useState(request?.student.factaddress)
    //const [citizenship, setCitizenship] = useState(request?.student.citizenship)
    const [passportsSeria, setPassportSeria] = useState(request?.student.passport_seria)
    const [passportNumber, setPassportNumber] = useState(request?.student.passport_number)
    //const [passportIssueBy, setPassportIssueBy] = useState(request?.student.passport_IssueBy)
    //const [passportIssueDate, setPassportIssueDate] = useState(request?.student.passport_IssueDate)
    //const [passportDepartmentCode, setPassportDepartmentCode] = useState(request?.student.passport_DepartmentCode)

    let navigate = useNavigate(); 

    const fetchDetailRequest = async () => {
        const resp = await $api.get(`/api/requests/${id}/`).then((resp) => {
            setPhone(resp.data.student.phone)
            setINN(resp.data.student.INN)
            setSNILS(resp.data.student.SNILS)
            setAddress(resp.data.student.address)
            setFactaddress(resp.data.student.factadress)
            setPassportSeria(resp.data.student.passport_seria)
            setPassportNumber(resp.data.student.passport_seria)
            setRequest(resp.data)
        })
        
      }


    useEffect(() => {
        fetchDetailRequest()
        
      }, [])
    const sendSaveRequest = (id:String) => {
        
        const response = $api
            .post('/api/edit/application/' + id  + '/', {
                'lastname':fio?.slice(0, fio.search(' ')),
                "firstname":fio?.slice(fio.search(' '), fio.lastIndexOf(' ')),
                'patronymic': fio?.slice(fio.lastIndexOf(' ')),
                "institut": institute,
                "phone": phone,
                "profile":direction,
                "form":educationForm,
                //"source_finance":financingSource,
                //"level":level,
                //"course":course,
                "INN":INN,
                "SNILS":SNILS,
                "address":address,
                "factadress":factaddress,
                //"citizenship":citizenship,
                "passport_seria":passportsSeria,
                "passport_number":passportNumber,
                "passport_IssueDate":formatDate,
                //"passport_IssueBy":passportIssueBy,
                //"passport_DepartmentCode":passportDepartmentCode

            }).then(r => console.info(r))
    }

    function formatDate(passportIssueDate: string | number | Date) {
        let d = new Date(passportIssueDate),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        return  [year, month, day].join('-'); ;
    }
        

    return <> 
        <StudentHeader />
        <form className='edite-form'>

            <FormFieldInput 
                label={'Телефон'} 
                maxLength={15}
                type={'text'} 
                value={phone} 
                onChange={(e: { target: { value: React.SetStateAction<string | undefined> } }) => setPhone(e.target.value)}         
        />
            <FormFieldInput 
                label={'ИНН'}
                maxLength={12} 
                type={'text'} 
                value={INN} 
                onChange={(e: { target: { value: React.SetStateAction<string | undefined> } }) => setINN(e.target.value)}         
        />
            <FormFieldInput 
                label={'СНИЛС'} 
                maxLength={11}
                type={'text'} 
                value={SNILS} 
                onChange={(e: { target: { value: React.SetStateAction<string | undefined> } }) => setSNILS(e.target.value)}         
        />
            <FormFieldInput 
                label={'Серия паспорта'} 
                maxLength={4}
                type={'text'} 
                value={passportsSeria} 
                onChange={(e: { target: { value: React.SetStateAction<string | undefined> } }) => setPassportSeria(e.target.value)}         
        />
            <FormFieldInput 
                label={'Номер паспорта'} 
                maxLength={6}
                type={'text'} 
                value={passportNumber} 
                onChange={(e: { target: { value: React.SetStateAction<string | undefined> } }) => setPassportNumber(e.target.value)}         
        />
        <FormFieldInput 
                label={'Адрес проживания по прописке'} 
                maxLength={200}
                type={'text'} 
                value={address} 
                onChange={(e: { target: { value: React.SetStateAction<string | undefined> } }) => setAddress(e.target.value)}         
        />

        <FormFieldInput 
                label={'Фактический адрес проживания'} 
                maxLength={200}
                type={'text'} 
                value={factaddress} 
                onChange={(e: { target: { value: React.SetStateAction<string | undefined> } }) => setFactaddress(e.target.value)}         
        />


        <button className='btn light-blue darken-2 waves-effect waves-light'
            onClick={(e) =>  {
                e.preventDefault();
                sendSaveRequest( String(request?.student?.id))
                navigate(`/admin/requests/${id}/`)    
            }}    
            >save
            </button>
            
    </form>
    
  </>

}


