import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../index.css'



interface FormFieldInputInterface {
    maxLength: number,
    label:string,
    type:string,
    value:any,
    onChange:Function,
}

interface FormFieldInterface{
    label:string,
    type:string,
    value:any,
}

export const FormFieldInput: FC <FormFieldInputInterface>  = (props:FormFieldInputInterface) => {
    return <>
        <label >{props.label}</label>
        <input 
            type={props.type}
            maxLength={props.maxLength}
            id="fname"
            value={props.value}
            name="fname"
            onChange={e => props.onChange(e)}
        />
        
    </>

}

export const FormField: FC <FormFieldInterface> = (props:FormFieldInterface) => {
    return <>
    <label >{props.label}</label>
    <input readOnly
        type={props.type}
        id="fname"
        value={props.value}
        name="fname"
    />
    
</>
}


interface checkboxFieldWithValue {
    label:string,
    onChange:Function,
    value:boolean
}

interface checkboxField {
    label:string,
    onChange:Function,
}

export const Checkbox: FC <checkboxField>  = (props:checkboxField) => {
    return <label >
            <input
                className='checkbox'
                onChange={e => props.onChange(e)}
                type="checkbox"
            />
        <span>{props.label}</span>
        </label>
        
    

}

export const CheckboxWithValue: FC <checkboxFieldWithValue>  = (props:checkboxFieldWithValue) => {
    return <label >
            <input
                checked={props.value}
                className='checkbox'
                onChange={e => props.onChange(e)}
                type="checkbox"
            />
        <span>{props.label}</span>
        </label>
        
    

}


interface FormAddSubCriterion {
    onChangeName:Function,
    onChangePaymentVo:Function,
    onChangePaymentSpo:Function,
    onClickDelete: Function,
    name: string
    paymentVo: number
    paymentSpo: number
}


export const FormFieldSubCriterion: FC <FormAddSubCriterion> = (props:FormAddSubCriterion) => {
    return <label>
        <a style={{float: 'right'}}
         className='btn-floating btn-small waves-effect waves-light red'
          onClick={e => props.onClickDelete(e)}
          >
            <i className="material-icons">
                delete
            </i>
        </a>

        <input
            id='subName'
            type='text'
            value={props.name}
            onChange={e => props.onChangeName(e)}
        />
        <label htmlFor='subName' >Название</label>
        <input
            id='paymentVoSub'
            type='number'
            value={props.paymentVo}
            onChange={e => props.onChangePaymentVo(e)}
        />
        <label htmlFor='paymentVoSub' >Выплата ВО</label>
        <input
            id="paymentSpoSub"
            type='number'
            value={props.paymentSpo}
            onChange={e => props.onChangePaymentSpo(e)}
        />
        <label htmlFor='paymentSpoSub' >Выплата СПО</label>
    </label>
}



