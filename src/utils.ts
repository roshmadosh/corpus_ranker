export type StateSetter<A> = (state: A) => void;


export const getCookie = () => document.cookie.substring(document.cookie.indexOf('=')+1)
export const setCookie = async () => await fetch('http://localhost:8000/cookie',  {
    method: 'POST',
    mode: "cors",
    headers: { 'Content-Type': 'application/json' },
}).then(res => res.json()).then(obj => obj['cookie']);