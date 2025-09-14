import axios from "axios";
import { UserData } from "../../contexts/userContext";
import { useState } from "react";
import editProfileImg from "../../utils/editProfileImg";
import uploadBlob from "../../utils/uploadImgToSupabase";
import { useContext } from "react";
import { ServerUrl } from "../../contexts/generalContext";
import getImgUrl from "../../utils/getImgUrl";

export default function EditAccount(props) {
    const {user: userObj, setUser: setUserObj} = UserData();
    const [userImg, setUSerImg] = useState();
    const server = useContext(ServerUrl);

    async function handleEdit(formData) {
        try {
            const res =await axios.patch(`${server}/edit/user`, 
            {
                email: formData.get("email"),
                first_name: formData.get("fName"),
                sec_name: formData.get("sName"),
                profile_pic_flag: userImg && userImg.base64 ? true : false // indication for editing picture field or not
            }, {headers: {'content-type': 'application/json'}, withCredentials: true});
            
            let {profile_pic, ...userData} = res.data.user;
            props.loading(true);

            if (userImg) {
                try {
                    if (userObj.user.profile_pic) { // edit on the same path
                        var imgPath = await editProfileImg(profile_pic, userImg.base64, userImg.type);
                        var imgUrl = await getImgUrl(imgPath); // to store in user context
                    } else { // adding new path
                        imgPath = await uploadBlob(userImg.base64, userImg.type);
                        imgUrl = await getImgUrl(imgPath); // to store in user context
                        await axios.patch(`${server}/update/profile_pic`, {
                            pic: imgPath
                        }, {headers: {'content-type': 'application/json'}, withCredentials: true});
                    }
                    userData = {...userData, profile_pic: imgUrl};      
                } catch (error) {
                    props.showError(error);
                    props.trigger();
                }
            }

            props.showSuccess("User info is Updated");
            props.showError(null);
            props.trigger();
            setUserObj(prev=> ({...prev, user: {...prev.user, ...userData}}));
            props.hideEdit();
            props.loading(false);
        } catch (error) {
            if (error.response) {                
                props.showError("Error: " + error.response.status + ", " + error.response.data);
            } else if (error.request) {
                props.showError("No response from server: " + error.request);
            } else {
                props.showError("Axios setup error: " + error.message);
            }            
            props.trigger();
        }
    }

    return(
        <>
            <div className='popup-div'>
                <h5 className="text-center m-3" style={{color: 'var(--warning)'}}>Edit at least one field <br /><em>(editing picture is not stable yet)</em></h5>
                <form action={handleEdit} className="d-flex flex-column align-items-center">
                    <div className="edit-user-img text-center">
                        <div id="pic" className="position-relative">
                            <img src={(userImg && userImg.base64) || userObj.user.profile_pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"} alt="Profile image" />
                            <input
                                type="file"
                                name="pic"
                                id="picInput" 
                                accept="image/png, image/jpeg"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(file);
                                        reader.onloadend = () => {                                        
                                            setUSerImg({base64: reader.result, type: file.type});
                                        };
                                    }
                                }}
                            />
                        </div>
                        <label htmlFor="picInput">
                            Profile picture
                        </label>
                    </div>
                    <label htmlFor="fname" className='mb-1'>
                        First name
                        <input type="text" name="fName" id="fname" className="form-control" placeholder={userObj.user.first_name} />
                    </label>
                    <label htmlFor="sname" className='mb-1'>
                        Second name
                        <input type="text" name="sName" id="sname" className="form-control"  placeholder={userObj.user.sec_name} />
                    </label>
                    <label htmlFor="email" className='mb-1'>
                        Email
                        <input type="email" name="email" id="email" className="form-control" placeholder={userObj.user.email} />
                    </label>
                    <button type='submit' className='btn btn-primary mt-3'>Save</button>
                </form>
                <button type='button' className='btn btn-secondary btn-hide-edit p-1' onClick={()=> {props.hideEdit(); setUSerImg()}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
        </>
    )
}