import { useState } from "react";
import { UserData } from "../../contexts/userContext";
import Login from "./Login";
import Notification from "../general UI/Notification";
import DeleteAccount from "./DeleteAccount";
import EditAccount from "./EditAccount";
import Section from "../general UI/Section";
import Loading from '../general UI/Loading';

export default function User() {
    const {user: userObj} = UserData();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [notificationTrigger, setNotificationTrigger] = useState(0);
    const [loading, setLoading] = useState(false);

    if (loading) return <Loading />;
    
    if (userObj.user) {
        return (
            <>
                <main className="user">
                    <div className="user-profile">
                        <div className= "user-img">
                            <img src={userObj.user.profile_pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"} alt="user Image" />
                        </div>
                        <div className="user-details p-3 d-flex flex-column align-items-center">
                            <h1><span style={{color: 'var(--sec-info)'}}>Name: </span>{userObj.user.first_name + " " + userObj.user.sec_name}</h1>
                            <h2><span style={{color: 'var(--sec-info)'}}>Email: </span>{userObj.user.email}</h2>
                            <div className="d-flex gap-3 mt-1">
                                <button className='btn btn-primary' onClick={()=>{setShowEdit(true)}}>
                                    Edit data
                                </button>
                                <button className='btn btn-danger' onClick={()=>{setShowDelete(true)}}>
                                    Delete account
                                </button>
                            </div>
                        </div>
                    </div>
                    {showEdit &&
                        <EditAccount 
                        hideEdit={()=>{ setShowEdit(false) }} 
                        showError={(error)=> {setError(error)}} 
                        showSuccess={(success)=> {setSuccess(success)}} 
                        trigger={()=> {setNotificationTrigger(prev=> prev+1)}}
                        loading = {(state)=> {setLoading(state)}} 
                        />
                    }
                    {showDelete && 
                        <DeleteAccount 
                        hideDelete={()=>{ setShowDelete(false) }}
                        showError={(error)=> {setError(error)}} 
                        trigger={()=> {setNotificationTrigger(prev=> prev+1)}} 
                        />
                    }
                    <div className="user-shows">
                        {userObj.favShows[0] &&
                            <>
                                <Section kind="movies" data={userObj.favShows.filter(show=> show.show_type=="movies")} title="Favourite Movies" />
                                <Section kind="series" data={userObj.favShows.filter(show=> show.show_type=="series")} title="Favourite Series" />
                            </> 
                        }
                        {userObj.laterShows[0] &&
                            <>
                                <Section kind="movies" data={userObj.laterShows.filter(show=> show.show_type=="movies")} title="Watch later Movies" />
                                <Section kind="series" data={userObj.laterShows.filter(show=> show.show_type=="series")} title="Watch later Series" />
                            </>
                        }
                    </div>
                </main>
                {error && <Notification message={error} trigger={notificationTrigger} />}
                {success && <Notification message={success} bgColor="green" trigger={notificationTrigger} />}
            </>
        )      
    } else {
        return <Login />
    }
}