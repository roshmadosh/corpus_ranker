import React from 'react'
import { FlagType } from '../utils'

export const Toast = ({ success, message }: FlagType) => {

    const className = `toast ${success ? 'success' : 'fail'}`
    return (
        <div className={className}>{message}</div>
    )
}