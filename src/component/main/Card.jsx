import { Link,  useNavigate } from "react-router-dom"
export default function Card() {
    const navigate = useNavigate();
    function handleBack() {
        navigate('/');
    }
    return (
        <div>
            <button onClick={handleBack}>Back to Home</button>
            <div>
                
            </div>
        </div>
    )
}