import { useNavigate } from "react-router-dom";

export function OnBoarding(){

    const navigate = useNavigate();

    return(
        <div>
            <h1>Onboarding</h1>
            <button onClick={() => navigate('/createChannel')}>Skip</button>
        </div>
    )
}