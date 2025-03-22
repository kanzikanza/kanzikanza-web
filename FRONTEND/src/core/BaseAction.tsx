import { Extension } from "@mui/icons-material"
import axios from "axios";

interface BaseActionInterface {
    arg : String 

    
}

class BaseAction {

}

class APIAction extends BaseAction {
    public MTD : string = ""
    public URL : string = ""
    public auth : string | null = ""
    public param : object | null = null
    public body : object | null = null
    public execute() {
        return axios({
            method: this.MTD,
            url : this.URL,
            headers : {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'Application/json',
                'Authorization' :  `Bearer ${this.auth}`
            },
            data : this.body,
            params : this.param
            
        })
    }
}


class APIActionBuilder {
    private apiAction : APIAction;

    constructor() {
        this.reset()
    }

    public reset() : void {
        this.apiAction = new APIAction()
    }

    public setUrl(URL : string)
    {
        this.apiAction.URL = URL
    }

    public setMTD(MTD : string)
    {
        this.apiAction.MTD = MTD
    }

    public setParam(param : object)
    {
        this.apiAction.param = param
    }

    public setAuth(auth : string)
    {
        this.apiAction.auth = auth
    }
    public setBody(body : object)
    {
        this.apiAction.body = body
    }

    public getAPIAction() : APIAction {
        const result = this.apiAction
        this.reset()
        return result
    }

}