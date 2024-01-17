'use client'
import { OpenVidu } from 'openvidu-browser';
import './page.css'
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import UserVideoComponent from './UserVideo';

const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:5000' : 'https://demos.openvidu.io/';

export default function App() {
    const [mySessionId, setMySessionId] = useState('SessionA')
    const [myUserName, setMyUserName] = useState(`Participant${Math.floor(Math.random() * 100)}`)
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
    // 엄청나게 많은 것들 state화 
    
    const OV = useRef(new OpenVidu());
    // OpenVidu useRef로 생성

    const handleChangeSessionId = useCallback((e) => {
        setMySessionId(e.target.value);
        // SessionId의 state를 변경
    }, []);

    const handleChangeUserName = useCallback((e) => {
        setMyUserName(e.target.value);
        // 나의 유저 정보를 변경
    }, []);

    const handleMainVideoStream = useCallback((stream) => {
        if (mainStreamManager !== stream) {
            setMainStreamManager(stream);
            // 스트림과 streamManager가 같은 상태가 아닐경우 mainstateManager의 상태를 변경해주는 콜백함수
        }
    }, [mainStreamManager]);
    
    const joinSession = useCallback(() => {
        // 세션에 참가할때에 대한 콜백함수 

        // 
        const mySession = OV.current.initSession();
        
        // mySession OV.current.initSession의 리턴객체는 
        mySession.on('streamCreated', (event) => {

            console.log( "=======================================================")
            console.log( event )
            console.log( "=======================================================")

            const subscriber = mySession.subscribe(event.stream, undefined);
            setSubscribers((subscribers) => [...subscribers, subscriber]);
        });
        // Subscriber을 추가함

        // 한 스트림이 사라졌을 경우에 
        // mySession.on('streamDestroyed', (event) => {
        //     deleteSubscriber(event.stream.streamManager);
        // });
        // stream 매니저에서 스트림 지움
        mySession.on('exception', (exception) => {
            console.warn(exception);
        });
        // 예외상황 발생시 표현하는 함수

        setSession(mySession);
        // 세션을 새로운 session으로 바꾼다.
    }, []);

    // 콜백함수가 4번 등장 

    useEffect(() => {
        if (session) {
            // Get a token from the OpenVidu deployment
            getToken().then(async (token) => {
                try {
                    await session.connect(token, { clientData: myUserName });

                    let publisher = await OV.current.initPublisherAsync(undefined, {
                        audioSource: undefined,
                        videoSource: undefined,
                        publishAudio: true,
                        publishVideo: true,
                        resolution: '640x480',
                        frameRate: 30,
                        insertMode: 'APPEND',
                        mirror: false,
                    });

                    session.publish(publisher);

                    const devices = await OV.current.getDevices();
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                    const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

                    setMainStreamManager(publisher);
                    setPublisher(publisher);
                    setCurrentVideoDevice(currentVideoDevice);
                } catch (error) {
                    console.log('There was an error connecting to the session:', error.code, error.message);
                }
            });
        }
    }, [session, myUserName]);

    // 세션과, 나의 username이 변경 되었을 때마다 실행되는 Effect함수 

    // 내가 세션을 떠날때 
    const leaveSession = useCallback(() => {
        // Leave the session
        if (session) {
            session.disconnect();
        }
        // 상태관리중인 세션이 있을경우 초기화
        // Reset all states and OpenVidu object
        OV.current = new OpenVidu();
        setSession(undefined);
        setSubscribers([]);
        setMySessionId('SessionA');
        setMyUserName('Participant' + Math.floor(Math.random() * 100));
        setMainStreamManager(undefined);
        setPublisher(undefined);
    }, [session]);

    const switchCamera = useCallback(async () => {
        try {
            const devices = await OV.current.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
            if (videoDevices && videoDevices.length > 1) {
                const newVideoDevice = videoDevices.filter(device => device.deviceId !== currentVideoDevice.deviceId);
    
                if (newVideoDevice.length > 0) {
                    const newPublisher = OV.current.initPublisher(undefined, {
                        videoSource: newVideoDevice[0].deviceId,
                        publishAudio: true,
                        publishVideo: true,
                        mirror: true,
                    });
                    // 새로운 퍼블리셔를 설정? 쉽게 말해 카메라 바꾸기, session객체는 publish, unpublish 를 통해서 카메라 바꿀 수 있음
                    if (session) {
                        await session.unpublish(mainStreamManager);
                        await session.publish(newPublisher);
                        setCurrentVideoDevice(newVideoDevice[0]);
                        setMainStreamManager(newPublisher);
                        setPublisher(newPublisher);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, [currentVideoDevice, session, mainStreamManager]);
    // 

    const deleteSubscriber = useCallback((streamManager) => {
        setSubscribers((prevSubscribers) => {
            const index = prevSubscribers.indexOf(streamManager);
            if (index > -1) {
                const newSubscribers = [...prevSubscribers];
                newSubscribers.splice(index, 1);
                return newSubscribers;
            } else {
                return prevSubscribers;
            }
        });
    }, []);
    // 지금 몇명 있는지를 확인해주는 stream Manager에서 한놈 지우기 하는 것 

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            leaveSession();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [leaveSession]);

    /**
     * --------------------------------------------
     * GETTING A TOKEN FROM YOUR APPLICATION SERVER
     * --------------------------------------------
     * The methods below request the creation of a Session and a Token to
     * your application server. This keeps your OpenVidu deployment secure.
     *
     * In this sample code, there is no user control at all. Anybody could
     * access your application server endpoints! In a real production
     * environment, your application server must identify the user to allow
     * access to the endpoints.
     *
     * Visit https://docs.openvidu.io/en/stable/application-server to learn
     * more about the integration of OpenVidu in your application server.
     */
    const getToken = useCallback(async () => {
        return createSession(mySessionId).then(sessionId =>
            createToken(sessionId),
        );
    }, [mySessionId]);

    const createSession = async (sessionId) => {
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The sessionId
    };

    const createToken = async (sessionId) => {
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The token
    };
    return (
        <div className="container">
            {session === undefined ? (
                <div id="join">
                    <div id="img-div">
                        <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" />
                    </div>
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1> Join a video session </h1>
                        <form className="form-group max-w-sm mx-auto" onSubmit={joinSession}>
                            <p>
                                <label className='label_form'>Participant: </label>
                                <input
                                    className="form-control input_form"
                                    type="text"
                                    id="userName"
                                    value={myUserName}
                                    onChange={handleChangeUserName}
                                    required
                                />
                            </p>
                            <p>
                                <label className='label_form'> Session: </label>
                                <input
                                    className="form-control  input_form"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={handleChangeSessionId}
                                    required
                                />
                            </p>
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}

            {session !== undefined ? (
                <div id="session">
                    <div id="session-header">
                        <h1 id="session-title">{mySessionId}</h1>
                        <input
                            className="btn btn-large btn-danger"
                            type="button"
                            id="buttonLeaveSession"
                            onClick={leaveSession}
                            value="Leave session"
                        />
                        <input
                            className="btn btn-large btn-success"
                            type="button"
                            id="buttonSwitchCamera"
                            onClick={switchCamera}
                            value="Switch Camera"
                        />
                    </div>

                    {mainStreamManager !== undefined ? (
                        <div id="main-video" className="col-md-6">
                            <UserVideoComponent streamManager={mainStreamManager} />

                        </div>
                    ) : null}
                    <div id="video-container" className="col-md-6">
                        {publisher !== undefined ? (
                            <div className="host-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                                <UserVideoComponent
                                    streamManager={publisher} />
                            </div>
                        ) : null}
                        <h1>Subscribers</h1>
                        {subscribers.map((sub, i) => (
                            <div key={sub.id} className="subscriber-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(sub)}>
                                <span>{sub.id}</span>
                                <UserVideoComponent streamManager={sub} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}