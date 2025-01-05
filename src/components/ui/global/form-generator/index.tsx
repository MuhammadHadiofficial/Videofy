import React from 'react'
import { FieldErrors, FieldValue, FieldValues, UseFormRegister } from 'react-hook-form'
import { Label } from '../../label'
import { Input } from '../../input'
import {ErrorMessage} from '@hookform/error-message'
import { Select, SelectItem } from '../../select'
import { Textarea } from '../../textarea'
type Props = {
    type?: 'text'|'email'|'password'|'number'|'date',
    inputType?:'select'|'input'|'textarea',
    options?:{
        label:string,
        value:string,
        id:string
    }[],
    placeholder?:string,
    label?:string,
    register?:UseFormRegister<any>,
    name:string,
    errors:FieldErrors<FieldValues>,
    lines?:number,
}

const FormGenerator = (
    {
        type,
        inputType,
        options,
        placeholder,
        label,
        register,
        name,
        errors,
        lines,  
    }
    : Props) => {
  switch (inputType) {
    case "input":
        return (
            <Label className='flex flex-col gap-2 text-[#9D9D9D]' htmlFor={`input-${label}`}>
                {label && label}
                <Input 
                id={`input-${label}`}
                type={type}
                placeholder={placeholder}
                className='bg-transparent boder-themeGray text-themeTextGray'
                {...register(name)}
                />
                <ErrorMessage errors={errors} name={name} render={({message})=>{
                    return (
                        <p className='text-red-500 mt-2'>{message==="Required"?"":message}</p>
                    )
                }}/>
            </Label>
        )
        break;
        case "textarea":
            return (
                <Label className='flex flex-col gap-2 text-[#9D9D9D]' htmlFor={`input-${label}`}>
                    {label && label}
                    <Textarea 
                    id={`input-${label}`}
                   rows={lines}
                    placeholder={placeholder}
                    className='bg-transparent boder-themeGray text-themeTextGray'
                    {...register(name)}
                    />
                    <ErrorMessage errors={errors} name={name} render={({message})=>{
                        return (
                            <p className='text-red-500 mt-2'>{message==="Required"?"":message}</p>
                        )
                    }}/>
                </Label>
            )
        case "select":
            <Label className='flex flex-col gap-2 text-[#9D9D9D]' htmlFor={`input-${label}`}>
            {label && label}
            <select 
            id={`input-${label}`}
         

            className='w-full bg-transparent boder-[1px] p-3 rounded-large'
            {...register(name)}
            >
                {
                    options && options.map((option,index)=>{
                        return (
                            <option className='dark:bg-muted' key={index} value={option.value}>{option.label}</option>
                        )
                    })
                }
                </select>
            <ErrorMessage errors={errors} name={name} render={({message})=>{
                return (
                    <p className='text-red-500 mt-2'>{message==="Required"?"":message}</p>
                )
            }}/>
        </Label>
            break;
  
    default:
        break;
  }
}
export default FormGenerator