import axios from 'axios'

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
export async function loginSession(){
    const url_replace1 = "http://localhost:8080/auth/isLoggedIn"
    let isFin : boolean = false
    try 
    {
        const response = await axios.get(
            url_replace1,
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Authorization : `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
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
        const url_replace2 = "http://localhost:8080/auth/Oauth2/updateToken"
        const reponse2 = await axios.post(
            url_replace2,
            {
                data: {
                    type: "UpdateRequest",
                    refreshToken: localStorage.getItem('refreshToken')
                }
            },
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                }
            }
        ).then(
            (response) => {
                console.log(response.data[1])
                localStorage.setItem('accessToken', response.data[1].accessToken)
                localStorage.setItem('refreshToken', response.data[1].refreshToken)
            }
        ).catch(
            (e) => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
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
    return localStorage.getItem('accessToken') !== null
}
function checkRefreshToken() {
    return localStorage.getItem('refreshToken') !== null
}

async function checkRefreshValid() {
    const url_replace2 = "http://localhost:8080/auth/Oauth2/updateToken"
    await axios.post(
            url_replace2,
            {
                data: {
                    type: "UpdateRequest",
                    refreshToken: localStorage.getItem('refreshToken')
                }
            },
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                }
            }
    ).then(
            (response) => {
                console.log(response.data[1])
                localStorage.setItem('accessToken', response.data[1].accessToken)
                localStorage.setItem('refreshToken', response.data[1].refreshToken)
                return true
            }
    ).catch(
        (e) => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            console.log(e)
            return false
            throw "refreshToken outdated"
        }
    )
    return false
}
async function checkAccessValid() {
    // 자바스크립트 async는 좀 제대로 볼필요가 있다
    const url_replace1 = "http://localhost:8080/auth/isLoggedIn"
    let level1 : boolean = false; 
    await axios.get(
        url_replace1,
        {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
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
        await checkAccessValid()
            .then((result : boolean) => { 
                console.log('access token valid')
                accLogin = result

        })
    }
    if (accLogin === false)
    {
        accLogin = checkRefreshToken()
    }
    else
    {
        return true    
    }
    if (accLogin)
    {
        await checkRefreshValid()
        .then((result: boolean) => { 
            return result
        })
    }
    return false    
}

export async function checkAuthority() {
    
    const url_replace1 = "http://localhost:8080/auth/isLoggedIn"

    try
    {
        if (localStorage.getItem('accessToken') === null) 
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
