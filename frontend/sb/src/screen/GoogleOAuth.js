import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { gapi } from 'gapi-script';
import "../css/Navs.css"
const CLIENT_ID = '298627830132-2akqakht3jcdsaqhnfumf6a7eeldrpo3.apps.googleusercontent.com'; // Replace with your Google Client ID
const API_KEY = 'AIzaSyAWcIWLDzGn_Fo8ojeioriNbrMA8-nd7yg'; // Replace with your Google API Key
const SCOPES = 'https://www.googleapis.com/auth/drive.file'; // Adjust based on the permissions you need
const blink = "http://localhost:3123"
const GoogleDriveUserUpload = forwardRef((props, ref) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [filename, setname] = useState("");
    const [sub, setsub] = useState("");
    const [loading, setload] = useState(false);
    const [msg, setmsg] = useState("");
    const fileInputRef = useRef(null);
    const deleteServer = async(fileId) => {
        const data1 = await fetch(blink + "/api/deleteFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: localStorage.getItem("username"), id: fileId })
        });
        const response = await data1.json();
        if (!response.success) {
            alert("Unable to Delete in mongo");
        } else {
            props.func();
        }
    }
    const deleteFileById = (fileId) => {
        console.log(fileId);
        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: new Headers({
                Authorization: `Bearer ${accessToken}`,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    console.log('File deleted successfully');
                    deleteServer(fileId);
                } else {
                    console.error('Error deleting file:', res.status, res.statusText);
                }
            })
            .catch((error) => {
                console.error('Error deleting file:', error);
            });

    };

    useImperativeHandle(ref, () => ({
        deleteFileById,
    }));
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            }).then(() => {
                const authInstance = gapi.auth2.getAuthInstance();
                setIsSignedIn(authInstance.isSignedIn.get());
                authInstance.isSignedIn.listen((signedIn) => setIsSignedIn(signedIn));

                // Get user info if already signed in
                if (authInstance.isSignedIn.get()) {
                    const user = authInstance.currentUser.get();
                    setUserInfo(user.getBasicProfile());
                }
            });
        };

        gapi.load('client:auth2', initClient);

    }, []);

    // Handle Google Sign In
    const handleSignIn = () => {
        gapi.auth2.getAuthInstance().signIn().then((user) => {
            setUserInfo(user.getBasicProfile());
            localStorage.setItem("logged",true);
        });
    };

    // Handle Google Sign Out
    const handleSignOut = () => {
        gapi.auth2.getAuthInstance().signOut().then(() => {
            setUserInfo(null);
            localStorage.setItem("logged",false);
        });
    };
    

    // Handle file upload
    const handleFileUpload = async () => {
        setload(true);
        const file = fileInputRef.current.files[0]; 

        if (!file) {
            console.error('No file selected');
            return;
        }

        const metadata = {
            name: file.name, // Name of the file
            mimeType: file.type // File type
            // Specify the parent folder ID if needed
        };

        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        try {
            const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
                body: form,
            });

            const data = await res.json(); // Await the JSON response

            if (res.ok) { // Check if the response is successful
                console.log('File uploaded successfully:', data);
                const fileId = data.id;
                const fileLink = `https://drive.google.com/file/d/${fileId}/view`;
                const uploadResponse = await fetch(blink + "/api/uploadFile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem("username"),
                        url: fileLink,
                        subject: sub,
                        filename: filename,
                        id: fileId
                    })
                });

                const uploadData = await uploadResponse.json();
                if (!uploadData.success) {
                    alert("File not updated to Mongo");
                    setload(false);
                } else {
                    props.func()
                    setname("");
                    setsub("");
                    setload(false);
                    fileInputRef.current.value = null;
                    setmsg("File Uploaded Successfully!")
                    const timer = setTimeout(() => {
                        setmsg("");
                    }, 3000);
                }
            } else {
                console.error('Error uploading file:', data);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };




    return (
        <div>
            {!isSignedIn ? (
                <button className='gbtn' onClick={handleSignIn}>Login with Google</button>
            ) : (
                <>
                    <button className='gbtn' onClick={handleSignOut}>Disconnect your Google Account</button>
                    <div className='input21'>
                        <h1 style={{ color: "#FF2E63" }}>Upload Files</h1>
                        
                        <input type="file" ref={fileInputRef} />
                        <input type="text" placeholder='filename' value={filename} onChange={(e) => setname(e.target.value)} />
                        <input type="text" placeholder='Subject' value={sub} onChange={(e) => setsub(e.target.value)} />
                        {loading ? <div class="loader"></div> : <h2 style={{ color: "#FF2E63" }}>{msg}</h2>}
                        <button id="btn" onClick={handleFileUpload} style={{ width: "120px" }}>Upload</button>
                    </div>
                </>
            )}
        </div>
    );
});

export default GoogleDriveUserUpload;
