"use client";

import axios from "axios";
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastFunc } from "../utils/ToastFun";


export interface FormData {
  fname: string;
  lname: string;
  address: string;
  phone: string;
  email: string;
}

export default function RegistrationForm() {

  const [formData, setFormData] = useState<FormData>({
    fname: "",
    lname: "",
    address: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fname) newErrors.fname = "First name is required.";
    if (!formData.lname) newErrors.lname = "Last name is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      await axios.post('http://localhost:8080/form/post', formData).then(() => {
        console.log("Form data submitted:", formData);
        console.log('Filled Successfully!');
        setFormData({
          fname: "",
          lname: "",
          address: "",
          phone: "",
          email: "",
        })
        ToastFunc('Form data submitted', 'success')
      }).catch((e) => {
        console.log(e)
        ToastFunc('Error', 'error')
      })
      setErrors({});
      // Handle successful form submission (e.g., send to an API or clear the form)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="fname" className="block mb-1 font-medium">
          First Name
        </label>
        <span>
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="First name"
          />
          {errors.fname && (
            <span className="text-red-500 text-sm">{errors.fname}</span>
          )}
        </span>
      </div>

      <div className="form-field">
        <label htmlFor="lname" className="block mb-1 font-medium">
          Last Name
        </label>
        <span>
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Last name"
          />
          {errors.lname && (
            <span className="text-red-500 text-sm">{errors.lname}</span>
          )}
        </span>
      </div>

      <div className="form-field">
        <label htmlFor="address" className="block mb-1 font-medium">
          Address
        </label>
        <span>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Address"
            rows={3}
          />
          {errors.address && (
            <span className="text-red-500 text-sm">{errors.address}</span>
          )}
        </span>
      </div>

      <div className="form-field">
        <label htmlFor="phone" className="block mb-1 font-medium">
          Phone
        </label>
        <span>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Phone"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone}</span>
          )}
        </span>
      </div>

      <div className="form-field">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <span>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </span>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}