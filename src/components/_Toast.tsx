import React from 'react'

export type ToastType = {
    success: boolean,
    message: string
}
export const Toast = ({ success, message }: ToastType) => {

    const className = `toast ${success ? 'success' : 'fail'}`
    return (
        <div className={className}>{message}</div>
    )
}