export const getCookie = (name: string) => {
    // document.cookie returns a single string of comma-separated key-value pairs of cookies
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length == 2)
        return parts.pop()?.split(';').shift();
}

export const setCookie = async () => await fetch('http://localhost:8000/cookie',  {
    method: 'POST',
    mode: "cors",
    headers: { 'Content-Type': 'application/json' },
}).then(res => res.json()).then(obj => obj['cookie']);