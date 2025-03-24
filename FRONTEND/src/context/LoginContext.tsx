import { createContext, useReducer } from "react";


type LoginAction = | {type : 'valid'} | {type : 'invalid'}

type Session = {
    isAuthenticated : boolean
}


function reducer(state: Session, action: LoginAction) : Session{
        if (action.type === 'valid')
        {
            return { isAuthenticated : true }
        }
        else if (action.type === 'invalid')
        {
            return { isAuthenticated: false }
        }    
        else
        {
            return state
        }
}
    
const initialSession = { isAuthenticated : false }
// export const LoginContext = createContext(
//     null
// )
    
export const LoginContext = createContext<{
  state: Session;
  dispatch: React.Dispatch<LoginAction>;
} | null>(null);

// loginContext.Provider =  

export const LoginContextProvider =  ({ children }) =>
{
    const [state, dispatch] = useReducer(reducer, initialSession)
    return (
        <LoginContext.Provider value={{state, dispatch}}>
            {children}
        </LoginContext.Provider>
    )
}

// loginContext.Provider = null;