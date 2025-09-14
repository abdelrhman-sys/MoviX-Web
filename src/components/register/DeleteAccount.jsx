import axios from "axios";
import { UserData } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ServerUrl } from "../../contexts/generalContext";

export default function DeleteAccount(props) {
    const {setUser: setUserObj} = UserData();
    const navigate = useNavigate();
    const server = useContext(ServerUrl);
    
    async function handleDelete(formData) {
        try {
            await axios.delete(`${server}/delete/user`, {
                data: {password: formData.get("password")},
                headers: {'content-type': 'application/json'},
                withCredentials: true
            });
            setUserObj({});
            props.showError();
            props.trigger();
            navigate("/");
        } catch (error) {            
            props.showError("Error " + error.response.status+ ", " + error.response.data);
            props.trigger();
        }
    }
    
    return (
        <>
            <div className="popup-div">
                <h5 className="text-center m-3" style={{color: 'var(--warning)'}}>Enter your password to delete the account</h5>
                <form action={handleDelete}>
                    <label htmlFor="password" className="mb-3">
                        Password
                        <input type="password" name="password" id="password" placeholder="password" className="form-control" required autoFocus />
                    </label>
                    <div className="d-flex gap-3">
                        <button className="btn btn-danger" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash me-1" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                            Delete
                        </button>
                        <button type='button' className='btn btn-secondary' onClick={()=> {props.hideDelete()}}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}