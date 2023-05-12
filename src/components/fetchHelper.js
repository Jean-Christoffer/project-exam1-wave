export default class FetchHelper {
    constructor(baseURL){
        this.baseURL = baseURL
    }
    async get(endpoint){
        const response = await fetch(this.baseURL + endpoint)
        return response
    }

    async post (endpoint,body){
        const response = await fetch(this.baseURL + endpoint,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json;charset=utf-8',
               
            },
            body:JSON.stringify(body)
        })
        const data = await response.json()
        return data
    }


}