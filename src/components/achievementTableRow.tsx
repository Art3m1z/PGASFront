import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../index.css'



interface FormAddTableRow {
    onClickDelete: Function
    onChangeDocumentNumber: Function
    onChangeAchivement: Function
    onChangeScore: Function
    onChangeDate: Function
    selectChange: Function
    onChangeMiracle: Function
    onChangeLevelMiracle: Function
    onChangeStateMiracle: Function
    onChangeTypeMiracle: Function


    achivement: string
    documentNumber: Number
    score: Number
    dateAchivement: Date

    miracle: []
    levelMiracle: []
    stateMiracle: []
    typeMiracle: []
}


export const FormFieldTableRow: FC<FormAddTableRow> = (props: FormAddTableRow) => {
    console.log(props.typeMiracle)
    return <tr>
        <td>
            <input
                onChange={e => props.onChangeAchivement(e)}
                placeholder={'Введите...'}
                value={props.achivement}
                type={'text'}
            />
        </td>
        <td>
            <select onChange={e => props.selectChange(e)} style={{ display: "block" }} >
                <option value="">--Выберите--</option>
                {props.miracle.map(element => (

                    <option>{element['name']}</option>
                ))}
            </select>
        </td>
        <td>
            <select style={{ display: "block" }} onChange={e => props.onChangeTypeMiracle(e)} >
                <option value="">--Выберите--</option>
                {props.typeMiracle.map(element => (

                    <option>{element['name']}</option>
                ))}
            </select>
        </td>
        <td>
            <select style={{ display: "block" }} onChange={e => props.onChangeLevelMiracle(e)} >
                <option value="">--Выберите--</option>
                {props.levelMiracle.map(element => (

                    <option>{element['name']}</option>
                ))}
            </select>
        </td>
        <td>
            <select style={{ display: "block" }} onChange={e => props.onChangeStateMiracle(e)} >
                <option value="">--Выберите--</option>
                {props.stateMiracle.map(element => (

                    <option>{element['name']}</option>
                ))}
            </select>
        </td>
        <td>
            <input
                onChange={e => props.onChangeDate(e)}
                //@ts-ignore
                value={props.dateAchivement}
                type='date'
                id='date' />
        </td>
        <td>
            <input
                onChange={e => props.onChangeDocumentNumber(e)}
                placeholder={'При наличие'}
                //@ts-ignore
                value={props.documentNumber}
                type={'number'}
            />
        </td>
        <td>
            <div
                className=''
                style={{
                    width: "80%",
                    height: "50px",
                    marginBottom: "0.6em",
                    display: 'flex',
                    gap: "10px"
                }}
            >


                <div className='btn light-blue darken-2' style={{
                    width: "50%",
                    height: "50px",
                    marginBottom: "0.6em",
                    display: 'flex',
                    gap: "10px"
                }} >
                    <label className='add-label'
                        htmlFor="files">
                        <i className='material-icons'
                            style={{ marginTop: "0.35em", fontSize: "24px" }}>
                            file_open
                        </i>
                    </label>
                    <input
                        hidden
                        className='hidden-input'
                        id="files"
                        type='file' />
                </div>
                <input
                    style={{ width: "100%" }}
                    type={'text'}
                />
            </div>


        </td>
        <td>
            <input
                onChange={e => props.onChangeScore(e)}
                //@ts-ignore
                value={props.score}
                placeholder={'0'}
                type={'number'}
            />
        </td>
        <td>
            <a style={{ float: 'right' }}
                className='btn-floating btn-small waves-effect waves-light red'
                onClick={e => props.onClickDelete(e)}
            >
                <i className="material-icons">
                    delete
                </i>
            </a>
        </td>

    </tr>

}