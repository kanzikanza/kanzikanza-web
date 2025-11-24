import axios from 'axios'
import useAuthStore from '@/store/useStore';
import api from '@/lib/api';
const NEXT_PUBLIC_SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP
export async function getProcess(url : string) {
    return Promise;
}


export async function useIndexedDB(str : string, db : any) {
    //IDBOpenDBRequest
    const request = indexedDB.open("db", 2);
    request.onupgradeneeded = e => {
	alert("upgrade is called");}
    request.onsuccess = e => {
        console.log(request)
        db = request.result
        alert("success is called")
        console.log(db)
    }
    request.onerror = e => {
        alert("error is called");
        db = null
    }
    // request.error = e => {
    // alert("error is called");}
}

export function createObject(db : any, name : string)
{
    var xhr = new XMLHttpRequest(),
        blob;
    xhr.open("GET", `${name}`, true);
    // Set the responseType to blob
    xhr.responseType = "blob";
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            console.log("Image retrieved");
            
            // File as response
            blob = xhr.response;
            console.log(blob, db)
            // Put the received blob into IndexedDB
            putImageInDb(blob, db);
        }
    }, false);
    // Send XHR
    console.log(xhr)
    xhr.send();
}

export function getImageFromIndexedDB(db: any, key : string = "image") {
    var transaction = db.transaction(["profile"], "readwrite");
    return transaction.objectStore("profile").get("image")
}

export function putImageInDb(blob: any, db : any)
{

    // Open a transaction to the database
    var transaction = db.transaction(["profile"], "readwrite");
    var put = transaction.objectStore("profile").put(blob, "image");

    transaction.objectStore("profile").get("image").onsuccess = function (event : any) {
                var imgFile = event.target.result;
                console.log("profile!" + imgFile);

                // Get window.URL object
                var URL = window.URL || window.webkitURL;

                // Create and revoke ObjectURL
                var imgURL = URL.createObjectURL(imgFile);

                // // Set img src to ObjectURL
                // var imgElephant = document.getElementById("elephant");
                // imgElephant.setAttribute("src", imgURL);

                // Revoking ObjectURL
                URL.revokeObjectURL(imgURL);
    };
}


// 나중에, 패턴, 함수별로 자동화하는게 나아보임
export async function loginSession() {
    

    const url_replace1 = "/auth/isLoggedIn"
    let isFin : boolean = false
    try 
    {
        const response = await api.get(
            url_replace1,
        ).then(
            (e) => {
                isFin = true
                return
            }
        ).catch(
            (e) => {
                console.log(e)
            }
        ) 
        if (isFin) return;

        // 여기에 그거있어야함 
        const url_replace2 = "/auth/Oauth2/updateToken"
        const reponse2 = await api.post(
            url_replace2,
            {},
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    withCredentials : true
                }
            }
        ).then(
            (response) => {
                console.log(response.data[1])
                useAuthStore.getState().setAccessToken(response.data[1].accessToken)
            }
        ).catch(
            (e) => {
                console.log(e)
                throw "refreshToken outdated"
            }
        )

    }
    catch (error)
    {
        throw "loginSession Failed"
    }
}
function checkAccessToken() {
    return useAuthStore.getState().accessToken !== null 
}
function checkRefreshToken() {
    return useAuthStore.getState().accessToken !== null 
}

async function checkRefreshValid() {
    const url_replace2 = NEXT_PUBLIC_SERVER_IP + "/auth/Oauth2/updateToken"
    await axios.post(
            url_replace2,
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    withCredentials : true
                }
            }
    ).then(
            (response) => {
                console.log(response.data[1])
                useAuthStore.getState().setAccessToken(response.data[1].accessToken)
                return true
            }
    ).catch(
        (e) => {
            console.log(e)
            return false
            throw "refreshToken outdated"
        }
    )
    return false
}
async function checkAccessValid() {
    // 자바스크립트 async는 좀 제대로 볼필요가 있다
    const url_replace1 = NEXT_PUBLIC_SERVER_IP + "/auth/isLoggedIn"
    let level1 : boolean = false; 
    await axios.get(
        url_replace1,
        {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Authorization: `Bearer ${useAuthStore.getState().accessToken}`
            }
        }
    ).then(
        (e) => {
            return true
        }
    ).catch(
        (e) => {
            console.log(e)
            return false
        }
    )
    return true
    // 이렇게 할경우엔 async를 사용하는 함수의경우엔 Promise만을 반환하기때문에 의미가 없고 
}



export async function checkAuthorityChain() {
    let accLogin = checkAccessToken()
    if (accLogin)
    {
        const res = await checkAccessValid()
            .then((result : boolean) => { 
                console.log('access token valid')
                accLogin = result
                return true
            }).catch(() => { return false })
        if (res === true)
        {
            return true
        }
    }
    // 여기서 업데이트 토큰 박아버리는게 확실함 왜냐면 애초에 한번쓰면 버린다고했으니까
    const url_replace2 = "/auth/Oauth2/updateToken"
    return await api.post(
        url_replace2,
        {},
        {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                withCredentials : true
            }
        }
    ).then(
        (response) => {
            useAuthStore.getState().setAccessToken(response.data[1].accessToken)
            return true
        }
    ).catch(
        (e) => {
            console.error(e)
            return false
        }
    )
}

// 지금 chain 자체가 의미가 없음, access 없으면 바로 update 때려버리는거임
export async function checkAuthority() {
    

    const url_replace1 = NEXT_PUBLIC_SERVER_IP + "/auth/isLoggedIn"
    
    try
    {
        if (useAuthStore.getState().accessToken === null) 
        {
            throw "accessToken is missing"
        }
        loginSession().catch(
            (e) => {throw 'loginsession failed'} 
        )
    }
    catch (error)
    {
        console.log(error)
        throw "authority is not valid"
    }
}
