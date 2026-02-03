import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Profile = () => {
    return (
        <>
            <SEO title="Profile" />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold">Profile Page</h1>
                <p className="mt-4">Profile management coming soon...</p>
                <Link to="/" className="btn btn-primary mt-4 inline-block">Go Home</Link>
            </div>
        </>
    );
};

export default Profile;
