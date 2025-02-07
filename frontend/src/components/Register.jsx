import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Make sure to import axios

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(res.data);
            setMessage("User registered successfully!");
            alert("User registered successfully!");
        } catch (err) {
            setMessage(err.response?.data?.error || "Registration failed.");
            console.error(err.response ? err.response.data : "Request Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                        Register
                    </button>
                </form>

                {message && <p className="text-center mt-4 text-red-500">{message}</p>}

                <p className="text-sm text-center text-gray-500 mt-4">
                    Already have an account? <Link to="/" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
