import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).catch(err=>console.log(err));

            console.log(res.data);
            setUser(res.data.user);
            
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (err) {
            // setMessage(err.response?.data?.error || "Login failed");
            setMessage(err.response.error)
            console.error(err.response ? err.response.data : "Request Failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                {!user ? (
                    <>
                        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                            Login
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-600 transition-all"
                            >
                                Login
                            </button>
                            <p className="text text-sm ">Dont have an Account <Link to="/register"><span className="underline text-emerald-950">Register Here</span></Link></p>
                        </form>
                        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
                    </>
                ) : (
                    <div className="mt-4 p-4 bg-green-100 rounded-lg">
                        <h3 className="text-lg font-semibold">Welcome, {user.username}!</h3>
                        <p>Email: {user.email}</p>
                        <p>User ID: {user.id}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white py-2 rounded-lg text-lg font-medium hover:bg-red-600 transition-all mt-4"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
