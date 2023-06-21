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
    onChangeFile: Function

    requestStatus: string
    achivement: string
    documentNumber: Number
    score: Number
    dateAchivement: string
    typeMiracle: string | undefined
    levelMiracle: string | undefined
    stateMiracle: string | undefined
    documentTitle: string | undefined
    miracleAchivement: string | undefined
    linckDocs: string


    miracle: []
    achivementmainState: Array<{}>
    index: number
}


export const FormFieldTableRow: FC<FormAddTableRow> = (props: FormAddTableRow) => {
    //@ts-ignore
    const typeAchive = props.achivementmainState[props.index]?.typeAchivement
    //@ts-ignore
    const levelAchive = props.achivementmainState[props.index]?.levelAchivement
    //@ts-ignore
    const stateAchive = props.achivementmainState[props.index]?.stateAchivement

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
            <select onChange={e => props.selectChange(e, props.index)} style={{ display: "block" }} >
                <option selected>{props.miracleAchivement ? props.miracleAchivement : '--Выберите--'}</option>
                {props.miracle.map(element => (

                    <option>{element['name']}</option>
                ))}
            </select>
        </td>
        <td>
            <select style={{ display: "block" }} onChange={e => props.onChangeTypeMiracle(e)} >
                <option selected>{props.typeMiracle ? props.typeMiracle : '--Выберите--'}</option>
                {typeAchive?.map((element: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }) => (
                    <option>{element['name']}</option>

                ))}
            </select>
        </td>
        <td>
            <select style={{ display: "block" }} onChange={e => props.onChangeLevelMiracle(e)} >
                <option selected>{props.levelMiracle ? props.levelMiracle : '--Выберите--'}</option>
                {levelAchive?.map((element: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }) => (
                    <option>{element['name']}</option>

                ))}

            </select>
        </td>
        <td>
            <select style={{ display: "block" }} onChange={e => props.onChangeStateMiracle(e)} >
                <option selected>{props.stateMiracle ? props.stateMiracle : '--Выберите--'}</option>
                {stateAchive?.map((element: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }) => (
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
                        htmlFor={"files" + props.index}>
                        <i className='material-icons'
                            style={{ marginTop: "0.35em", fontSize: "24px" }}>
                            file_open
                        </i>
                    </label>
                    <input
                        onChange={e => props.onChangeFile(e)}
                        hidden
                        className='hidden-input'
                        id={"files" + props.index}
                        type='file' />

                </div>

                <input
                    value={props.documentTitle}
                    style={{ width: "100%", display: "flex" }}
                    type={'text'}

                />
                {props.requestStatus === "Отправлено на доработку" && props.linckDocs !== '' ?
                    <div style={{ height: "20px" }} >
                        <p style={{ marginTop: "2em", marginRight: "0em", width: "0px", fontSize: "10px" }}><a
                            className='waves-effect waves-light  tooltipped'
                            href={props.linckDocs}
                            data-position='top'
                            data-tooltip-img={props.linckDocs}
                        >Текущий файл </a></p>
                    </div> :
                    <div></div>
                }


            </div>


        </td>
        <td>
            <input
                onChange={e => props.onChangeScore(e)}
                //@ts-ignore
                value={props.score}
                placeholder={'0'}
                type={'number'}
                readOnly
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
