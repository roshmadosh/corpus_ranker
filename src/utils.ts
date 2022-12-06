const environment = {
    LOCAL: 'localhost',
    PROD: '54.152.251.12'
}

export const URL = environment.PROD;

export const getCookie = (name: string) => {
    // document.cookie returns a single string of comma-separated key-value pairs of cookies
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length == 2)
        return parts.pop()?.split(';').shift();
}

export const setCookie = async () => await fetch(`http://${URL}/cookie`,  {
    method: 'POST',
    mode: "cors",
    headers: { 'Content-Type': 'application/json' },
}).then(res => res.json()).then(obj => obj['cookie']);