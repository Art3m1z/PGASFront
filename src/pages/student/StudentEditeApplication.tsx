import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import MediaQuery from "react-responsive"
import { useParams, useNavigate } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import '../../index.css'
import { Link } from 'react-router-dom'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import $api from '../../http'
import { FormFieldInput, FormField } from '../../components/formFieldInput'


export const StudentEditeApplication: FC = () => {
    const { requests, fetchRequests, addComment } = useContext(RequestContext)
    const { id } = useParams()
    const request = requests.find((element) => element.id === parseInt(String(id), 10))

    const [fio, setFio] = useState(request?.student.fio)
    const [phone, setPhone] = useState(request?.student.phone)
    const [institute, setInstitute] = useState(request?.student.institute)
    const [direction, setDirection] = useState(request?.student.direction)
    const [educationForm, setEducationForm] = useState(request?.student.educationForm)
    const [financingSource, setFinancingSource] = useState(request?.student.financingSource)
    const [level, setLevel] = useState(request?.student.level)
    const [course, setCourse] = useState(request?.student.course)
    const [INN, setINN] = useState(request?.student.INN)
    const [SNILS, setSNILS] = useState(request?.student.SNILS)
    const [address, setAddress] = useState(request?.student.address)
    const [fatcaddress, setFatcaddress] = useState(request?.student.fatcaddress)
    const [citizenship, setCitizenship] = useState(request?.student.citizenship)
    const [passportsSeria, setPassportSeria] = useState(request?.student.passport_seria)
    const [passportNumber, setPassportNumber] = useState(request?.student.passport_number)
    const [passportIssueBy, setPassportIssueBy] = useState(request?.student.passport_IssueBy)
    const [passportIssueDate, setPassportIssueDate] = useState(request?.student.passport_IssueDate)
    const [passportDepartmentCode, setPassportDepartmentCode] = useState(request?.student.passport_DepartmentCode)

    let navigate = useNavigate(); 
   


    const sendSaveRequest = (id:String) => {
        
        const response = $api
            .post('/api/edit/application/' + id  + '/', {
                'lastname':fio?.slice(fio.search(' '), fio.lastIndexOf(' ')),
                "firstname":fio?.slice(0, fio.search(' ')),
                'patronymic': fio?.slice(fio.lastIndexOf(' ')),
                "institut": institute,
                "phone": phone,
                "profile":direction,
                "form":educationForm,
                "source_finance":financingSource,
                "level":level,
                "course":course,
                "INN":INN,
                "SNILS":SNILS,
                "address":address,
                "factadress":fatcaddress,
                "citizenship":citizenship,
                "passport_seria":passportsSeria,
                "passport_number":passportNumber,
                "passport_IssueDate":formatDate,
                "passport_IssueBy":passportIssueBy,
                "passport_DepartmentCode":passportDepartmentCode

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

            <MediaQuery maxWidth={900}>
                <Link style={{ marginRight: 70, marginLeft: 70 }}  to={`/requests/${request?.id}`}>
                <button className='pos btn light-blue darken-2 waves-effect waves-light '><i className='material-icons'>arrow_back</i></button>
                </Link>
            </MediaQuery>
        <form className='edite-form '>

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

        <MediaQuery maxWidth={900}>
            <form className='disabled'>

            <FormField
                label={'Фамилия'}

                type={'text'} 
                value={fio?.slice(0, fio.search(' '))}     
            />

            <FormField
                label={'Имя'} 

                type={'text'} 
                value={fio?.slice(fio.search(' '), fio.lastIndexOf(' '))} 
                />

            <FormField
                label={'Отчество'} 
 
                type={'text'} 
                value={fio?.slice(fio.lastIndexOf(' '))} 
             />
            <FormField
                label={'Институт'} 

                type={'text'} 
                value={institute} 
                  
            />
            <FormField
                label={'Направление'} 

                type={'text'} 
                value={direction} 
                      
            />
            
            <FormField
                label={'Образовательная форма'} 

                type={'text'} 
                value={educationForm} 
                      
            />

            <FormField
                label={'Источник финансирования'} 

                type={'text'} 
                value={financingSource} 
                      
            />

            <FormField
                label={'Уровень образования'} 

                type={'text'} 
                value={level} 
                      
            />
            
            <FormField
                label={'Курс'} 

                type={'text'} 
                value={course} 
                      
            />

            <FormField
                label={'Адрес проживания'} 

                type={'text'} 
                value={address} 
                      
            />
            
            <FormField
                label={'Прописка'} 
                type={'text'} 
                value={fatcaddress} 
                      
            />
            
            <FormField
                label={'Семейное положение'} 
                type={'text'} 
                value={citizenship} 
                      
            />
            <FormField
                label={'Дата выдачи паспорта'} 
                type={'text'} 
                value={formatDate} 
                      
            />
            
            <FormField
                label={'Дата окончания паспорта'} 
                type={'text'} 
                value={passportIssueBy} 
                      
            />
            
            <FormField
                label={'Код департамента'} 
                type={'text'} 
                value={passportIssueBy} 
                      
            />
            
            
            
            </form>
        </MediaQuery>

        <button className='btn light-blue darken-2 waves-effect waves-light'
            onClick={(e) =>  {
                e.preventDefault();
                sendSaveRequest( String(request?.student?.id))
                navigate('/requests/' + request?.id)    
            }}    
            >save
            </button>
            
    </form>
    {/* </MediaQuery> */}
    
  </>

}


