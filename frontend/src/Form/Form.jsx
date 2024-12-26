import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';

const Form = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        aadhar: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const formSchema = z.object({
        name: z.string().min(3, "must be of minimum 3 letters"),
        email: z.string().email("Invalid email"),
        phone: z.string().length(10, "Phone number must be of 10 digits"),
        aadhar: z.string().length(12, "Must be of 12 characters")
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleAadharCheck = async (event) => {
        try {
            const response = await axios.get(`https://localhost:5001/user/${formData.aadhar}`);
            setFormData(response.data);
            setMessage("User data found");
        } catch (err) {
            setMessage("No user found");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate form data using zod
        try {
            formSchema.parse(formData);  // This will throw an error if validation fails
            const response = await axios.post("http://localhost:5001/submit", formData);
            alert(response.data.message);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = error.errors.reduce((acc, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(newErrors);
            } else {
                alert("Error while submitting the form");
            }
        }
    };

    return (
        <div>
            <h2>Registration Form</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ margin: '20px' }}>
                    <label>Name</label>
                    <input onChange={handleChange} name='name' type='text' value={formData.name} required />
                    {errors.name && <span>{errors.name}</span>}
                </div>
                <div style={{ margin: '20px' }}>
                    <label>Email</label>
                    <input type='email' name='email' value={formData.email} onChange={handleChange} required />
                    {errors.email && <span>{errors.email}</span>}
                </div>
                <div style={{ margin: '20px' }}>
                    <label>Phone number</label>
                    <input type="tel" name='phone' value={formData.phone} onChange={handleChange} required />
                    {errors.phone && <span>{errors.phone}</span>}
                </div>
                <div style={{ margin: '20px' }}>
                    <label>Aadhar number</label>
                    <input type='text' name='aadhar' onBlur={handleAadharCheck} value={formData.aadhar} onChange={handleChange} />
                    {errors.aadhar && <span>{errors.aadhar}</span>}
                </div>
                <button type='submit'>Submit</button>
                <p>{message}</p>
            </form>
        </div>
    );
};

export default Form;
