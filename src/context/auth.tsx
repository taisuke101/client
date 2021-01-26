import { createContext, useContext, useEffect, useReducer } from "react"
import Axios from 'axios';

import { User } from "../types";

interface State {
    authenticated: boolean;
    user: User | undefined;
    loading: boolean;
};

interface Action {
    type: string;
    payload: any;
}

const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
    switch(type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload
            }
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null
            }
        case "STOP_LOADING":
            return {
                ...state,
                loading: false
            }
        default:
            throw new Error(`予期しないエラーが発生しました！: ${type}`)
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, defaultdispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true,
    })

    const dispatch = (type:string, payload?:any) => defaultdispatch({ type, payload});

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await Axios.get('/auth/me');
                dispatch("LOGIN", res.data);
            } catch (err) {
                console.log(err);
            } finally {
                dispatch("STOP_LOADING")
            }
        }
        loadUser();
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                { children }
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);