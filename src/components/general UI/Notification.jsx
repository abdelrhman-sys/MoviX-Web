import { useEffect, useState } from "react";

export default function Notification(props) {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (props.message) {
            setShowNotification(true);            
            const timeout = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [props.message, props.trigger]);

    return (
        <div className={`notification${showNotification ? " notification-show" : ""}`} style={{backgroundColor: props.bgColor ? "var(--success)": "var(--error)"}}>
            <p className="notification-text">
                {props.message}
                {props.bgColor&&
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle ms-1" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                }
            </p>
        </div>
    );
}