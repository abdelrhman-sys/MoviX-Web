import { useState } from "react";
import axios from "axios";
import { UserData } from "../../contexts/userContext";
import Notification from "../general UI/Notification";
import { useNavigate } from "react-router-dom";
import uploadBlob from '../../utils/uploadImgToSupabase';
import getImgUrl from "../../utils/getImgUrl";
import { ServerUrl } from "../../contexts/generalContext";
import { useContext } from "react";

export default function SignUp() {
    const server = useContext(ServerUrl);
    const [img, setImg] = useState();
    const {setUser} = UserData();
    const [error, setError] = useState();
    const [errorTrigger, setErrorTrigger] = useState(0); // trigger the useEffect in notification to call the callback
    const navigate = useNavigate();

    async function handleSignup(formData) {
        try {
            // First register the user without the profile picture
            const res = await axios.post(`${server}/newuser`, {
                email: formData.get("email"),
                password: formData.get("password"),
                firstName: formData.get("fName"),
                secName: formData.get("sName"),
                pic: null // Initially set to null
            } , {headers: {'content-type': 'application/json'}, withCredentials: true});
            
            let userData = res.data;
            setUser(userData); // to move the value to other pages
            if (img && img.base64) { // If registration is successful upload img and update the user profile
                try {
                    const imgPath = await uploadBlob(img.base64, img.type);
                    const imgUrl = await getImgUrl(imgPath); // to store in user context
                    await axios.patch(`${server}/update/profile_pic`, {
                        pic: imgPath
                    }, {headers: {'content-type': 'application/json'}, withCredentials: true});
                    userData = {...userData, user: {...userData.user, profile_pic: imgUrl}}; // update user data including the profile pic
                } catch (imgError) {
                    setError("Failed to upload profile image: " + imgError);
                    setErrorTrigger(errorTrigger + 1);
                }
            }

            setUser(userData); // updating the profile img
            navigate("/");
        } catch (error) {
            if (error.response) {
                setError("Error: " + error.response.status + " " + error.response.data);
            } else if (error.request) {
                setError("No response from server");
            } else {
                setError("Server error, try again later");
            }
            setErrorTrigger(errorTrigger+1);
        }
    }

    async function handleGoogle() {
        window.location.href = `${server}/google/user`;
    }

    return (
        <>
            <main className="form-signup">
                <form action={handleSignup}>
                    <div className="signup-pic">
                        <div id="pic">
                            <img src={(img && img.base64) || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"} alt="profile image" />
                            <input
                                type="file"
                                name="pic"
                                id="picInput" 
                                accept="image/jpeg"
                                onChange={e => {
                                    const file = e.target.files[0];                                    
                                    if (file && (file.size <= 1000000 * 2)) {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(file);
                                        reader.onloadend = () => {                                        
                                            setImg({base64: reader.result, type: file.type});   
                                        };
                                    }
                                    else {
                                        setError("Max size is 2MB");
                                        setErrorTrigger(errorTrigger + 1);
                                    }
                                }}
                            />
                        </div>
                        <label htmlFor="picInput">Profile picture</label>
                    </div>
                    <div className="signup-detail">
                        <div>
                            <h1>Hello, You!</h1>
                            <hr />
                        </div>
                        <div className='d-flex gap-3 FS-name'>
                            <label htmlFor="fname">
                                First name
                                <input type="text" name="fName" id="fname" className="form-control p-2 rounded-3" placeholder="first name" required />
                            </label>
                            <label htmlFor="sname">
                                Second name
                                <input type="text" name="sName" id="sname" className="form-control p-2 rounded-3" placeholder="second name" required />
                            </label>
                        </div>
                        <label htmlFor="email">
                            Email
                            <input type="email" name="email" id="email" className="form-control p-2 rounded-3" placeholder="email" required />
                        </label>
                        <label htmlFor="password">
                            Password
                            <input type="password" name="password" id="password" className="form-control p-2 rounded-3" placeholder="password" required />
                        </label>

                        <div className="d-flex flex-column gap-2">
                            <button className="btn btn-primary w-100 py-2 signup-submit" type="submit">
                                sign Up
                            </button>
                            <button className="btn btn-secondary w-100 py-2 login-google" type="button" onClick={handleGoogle}>
                                Sign up with Google
                                <img className="ms-1" width="20" height="20" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo"/>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            {error && <Notification message={error} trigger={errorTrigger} />}
        </>
    )
}