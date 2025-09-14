import {Link, useNavigate} from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserData } from "../../contexts/userContext";
import Notification from "../general UI/Notification";
import { ServerUrl } from "../../contexts/generalContext";
import getImgUrl from "../../utils/getImgUrl";

export default function Login() {
    const {setUser} = UserData();
    const [error, setError] = useState();
    const [errorTrigger, setErrorTrigger] = useState(0);
    const navigate = useNavigate();
    const server = useContext(ServerUrl);

    async function handleSubmit(formData) {
        try {
            const {data} = await axios.post(`${server}/local/user`, {
                email: formData.get("email"),
                password: formData.get("password"),
            } , {headers: {'content-type': 'application/json'}, withCredentials: true});
            setUser(data); // to move the value to other pages
            navigate("/");

            if (data.user.profile_pic) {
                var imgUrl = await getImgUrl(data.user.profile_pic);
                setUser({...data, user: {...data.user, profile_pic: imgUrl}});
            }
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
            <main className="form-signin">
                <form action={handleSubmit}>
                    <div>
                        <h1 className="mb-4">Welcome back</h1>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            required
                        />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            required
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <button className="btn btn-primary w-100 py-2 login-submit" type="submit">
                            Login
                        </button>
                        <button className="btn btn-secondary w-100 py-2 login-google" type="button" onClick={handleGoogle}>
                            Sign in with Google
                            <img className="ms-1" width="20" height="20" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo"/>
                        </button>
                    </div>
                    <div className="or-login position-relative text-center m-3">
                        <hr className="m-1" />
                        <hr className="m-1" />
                    </div>
                    <Link to="/signUp">
                        <p className="new-account-p">Create a new account</p>
                    </Link>
                </form>
            </main>
            {error && <Notification message={error} trigger={errorTrigger} />}
        </>
    )
}