import React from "react";
import { useFormik } from "formik";
import DropDown from "./DropDown";

import { useTypeContext } from "../context/TypeContext.js";

const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "First Name cannot be empty";
  } else if (values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  }

  if (!values.lastName) {
    errors.lastName = "Last Name cannot be empty";
  } else if (values.lastName.length > 20) 
    {
    errors.lastName = "Must be 20 characters or less";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must not be less than 8 characters";
  }

  return errors;
};



function FormSection() {

  const {type} = useTypeContext();
  

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="section-container">
      <div className="trial-btn text-white cursor-pointer">
        <span className="text-bold">Welcome To Ducksplorer</span> 
      </div>
      <div className="form-container">
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="Username"
            id="Username"
            onChange={formik.handleChange}
            value={formik.values.firstName}
          />
          {formik.errors.firstName ? (
            <div className="error">{formik.errors.Username}</div>
          ) : null}
          {formik.errors.lastName ? (
            <div className="error">{formik.errors.lastName}</div>
          ) : null}
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            id="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
        />
          {type === "Tourist" && <div> 
            <input
            type="text"
            placeholder="Mobile Number"
            name="mobileNumber"
            id="mobileNumber"
            onChange={formik.handleChange}
            value={formik.values.mobileNumber}
          />
          <input
            type="text"
            placeholder="Nationality"
            name="nationality"
            id="nationality"
            onChange={formik.handleChange}
            value={formik.values.nationality}
          />
           <input
            type="Date"
            placeholder="Date of birth"
            name="DOB"
            id="DOB"
            onChange={formik.handleChange}
            value={formik.values.DOB}
          /> 
          <input
            type="text"
            placeholder="Employment Status"
            name="employmentStatus"
            id="employmentStatus"
            onChange={formik.handleChange}
            value={formik.values.employmentStatus}
          />
           </div>}
         <DropDown />
          <button
            type="submit"
            className="submit-btn text-white cursor-pointer"
          >
            Signup
          </button>
        </form>
        <p className="terms-text">
          By clicking the button, you are agreeing to our&nbsp;
          <a href="nothing" className="terms-link">
            Terms and Services
          </a>
        </p>
      </div>
    </div>
  );
}
export default FormSection;