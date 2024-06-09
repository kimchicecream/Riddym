import { useParams } from 'react-router-dom';
import './SessionOverview.css';

function SessionOverview() {
    const { username } = useParams();
    return (
        <div className='session-overview-page'>
            <h1>Welcome, {username}.</h1>
        </div>
    )
}

export default SessionOverview;
