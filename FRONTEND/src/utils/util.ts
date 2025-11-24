import axios, {AxiosError, AxiosResponse} from "axios";
import { headers } from "next/headers";
import useAuthStore from '@/store/useStore'

type ResponseContent<T = any> = {
    status: 'logout' | 'success'
    data : T
}

function axiosWithCredential(url: String) {
    // const { count, increment, decrement, reset } = useCounterStore();
    const { accessToken, setAccessToken } = useAuthStore()
    const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
    try {
        if (accessToken === null || accessToken === "")
        {
            const err: AxiosError = new AxiosError(
                'No Access Token',
                'ERR_BAD_REQUEST',  // code
                undefined,          // config (필요 없으면 undefined)
                undefined,          // request
                {
                    data: null,
                    status: 401,
                    statusText: 'Unauthorized',
                    headers: {},
                    config: {} as any,   // 타입 우회 (실무에선 이렇게 씀)
                } as AxiosResponse
            )
            throw err
        }
        axios.create({
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).get(url = url.toString())
            .then(
            (res) => {
                    // Url의 데이터를 제대로 리턴해줘야함
                    return res.data
            }
        ).catch((err) => {
            throw err
        })
    }
    catch (err)
    {
        if (err.status === 401)
        {
            try {
                return axios.create({
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).get(
                    url = `${NEXT_PUBLIC_SERVER_IP}/auth/refreshTokens`,
                    
                ).then((response) => { 
                    setAccessToken(response.data.accessToken)
                    return axiosWithCredential(url)
                }).catch((err) => {
                    throw err
                })
                
            }
            catch {
                // refresh 토큰이 안됐다는 소리니까 다시 로그인하라고 해줘야함
            }
        }
    }
    
}