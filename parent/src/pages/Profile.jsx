import '../css/Profile.css';

function Profile() {
    return (
        <div className="profile">
            <h2>Account Settings</h2>
            <h4>Username</h4>
            <div className="input-field">
                <input id="username" required className="input" type="text" />
                <label className="label" htmlFor="username">Enter Username</label>
            </div>
            <div className="profile-row">
                <div>
                    <h4>First Name</h4>
                    <div className="input-field">
                        <input id="first-name" required className="input" type="text" />
                        <label className="label" htmlFor="first-name">Enter First Name</label>
                    </div>
                </div>
                <div>
                    <h4>Last Name</h4>
                    <div className="input-field">
                        <input id="last-name" required className="input" type="text" />
                        <label className="label" htmlFor="last-name">Enter Last Name</label>
                    </div>
                </div>
            </div>
            <div className="profile-row">
                <div>
                    <h4>Email address</h4>
                    <div className="input-field">
                        <input id="email" required className="input" type="email" />
                        <label className="label" htmlFor="email">Enter Email</label>
                    </div>
                </div>
                <div>
                    <h4>Location</h4>
                    <div className="input-field">
                        <input id="location" required className="input" type="text" />
                        <label className="label" htmlFor="location">Enter Location</label>
                    </div>
                </div>
            </div>
            <h4>Bio</h4>
            <div className="input-field">
                <textarea id="bio" required className="input" />
                <label className="label" htmlFor="bio">Enter Bio</label>
            </div>
            <button className="submit-btn" type="submit">Save Changes</button>
        </div>
    );
}

export default Profile;
