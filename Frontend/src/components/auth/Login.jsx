import React, { useState } from 'react'
import "../../auth.form.scss"
import { useNavigate } from 'react-router'
import { useAuth } from '../../hook/useAuth'

const Login = () => {
    const { loading, error, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await handleLogin({ email, password });
        if (success) {
            navigate("/dashboard");
        }
    };

    if (loading) {
        return (
            <main>
                <h1>Loading......</h1>
            </main>
        )
    }

    return (
        <main>
            <div className="login-page">
                <div className="brand">
                    <span className="brand-pothole">Pothole</span>
                    <span className="brand-guard">Guard</span>
                </div>

                <div className="form-container">
                    <h1>Official Login</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p style={{ color: "#f4574f", fontSize: 13, marginTop: 8 }}>{error}</p>
                        )}

                        <button className="button primary-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login