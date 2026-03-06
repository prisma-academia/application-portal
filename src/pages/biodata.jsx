import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stateList } from "../assets/stateList";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/forminput";
import SelectInput from "../components/selectinput";
import MyButton from "../components/button";
import useFormStore from "../store/form";
import { useAuthStore } from "../store/auth";

const photo_size_limit = 1020000; // 1MB

function BioData() {
  const updateForm = useFormStore((state) => state.updateForm);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name can't be longer than 50 characters")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name can't be longer than 50 characters")
      .required("Last Name is required"),
    gender: Yup.string()
      .oneOf(["Male", "Female"], "Invalid Gender")
      .required("Gender is required"),
    religion: Yup.string()
      .oneOf(["Islam", "Christianity"], "Invalid Religion")
      .required("Religion is required"),
    dob: Yup.date()
      .max(new Date(), "Date of Birth can't be in the future")
      .required("Date of Birth is required"),
    stateOfOrigin: Yup.string()
      .min(2, "State of Origin must be at least 2 characters")
      .required("State of Origin is required"),
    lgaOfOrigin: Yup.string()
      .min(2, "LGA of Origin must be at least 2 characters")
      .required("LGA of Origin is required"),
    nin: Yup.string()
      .matches(
        /^\d{11}$/,
        "NIN must be exactly 11 digits and consist of numbers only"
      )
      .required("NIN is required").optional(),
    phoneNumber: Yup.string()
      .matches(
        /^\d{11}$/,
        "Phone Number must be exactly 11 digits and consist of numbers only"
      )
      .required("Phone Number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    stateOfResidence: Yup.string()
      .min(2, "State of Residence must be at least 2 characters")
      .required("State of Residence is required"),
    lgaOfResidence: Yup.string()
      .min(2, "LGA of Residence must be at least 2 characters")
      .required("LGA of Residence is required"),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .max(100, "Address can't be longer than 100 characters")
      .required("Address is required"),
    photo: Yup.mixed()
      .required("Invalid photo criteria")
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      otherName: "",
      gender: "",
      religion:"",
      dob: "",
      stateOfOrigin: "",
      lgaOfOrigin: "",
      nin: "",
      phoneNumber: "",
      email: user.email,
      stateOfResidence: "",
      lgaOfResidence: "",
      address: "",
      photo: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateForm(values);
      navigate("/form/examination");
    },
  });

  const handleStateChange = (stateField, lgaField, value) => {
    formik.setFieldValue(stateField, value);
    formik.setFieldValue(lgaField, "");
  };

  const selectedState = (field) =>
    stateList.find((item) => item.state === formik.values[field]);

  const handlePhotoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (
        file.size <= photo_size_limit &&
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      ) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setPhotoPreview(base64String);
          formik.setFieldValue("photo", base64String); // Assign the base64 string to the photo field
        };
        reader.readAsDataURL(file); // Convert file to base64 string for preview
      } else {
        setPhotoPreview(null);
        console.log("Photo must be a jpeg, jpg, or png and less than 1MB");
        formik.setFieldError(
          "photo",
          "Photo must be a jpeg, jpg, or png and less than 1MB"
        );
      }
    } else {
      setPhotoPreview(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-6 px-6">
            <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            <p className="text-pink-100 mt-1">Please provide your personal and contact details</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="First Name"
                      name="firstName"
                      placeholder="Type First Name"
                      formik={formik}
                    />
                    <FormInput
                      label="Last Name"
                      name="lastName"
                      placeholder="Type Last Name"
                      formik={formik}
                    />
                    <FormInput
                      label="Other Name"
                      name="otherName"
                      placeholder="Type Other Name"
                      formik={formik}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      formik={formik}
                    />

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Gender
                        </label>
                        <div className="mt-1 flex space-x-4 bg-white border border-slate-300 rounded-lg p-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value="Male"
                              checked={formik.values.gender === "Male"}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="form-radio h-4 w-4 text-pink-600"
                            />
                            <span className="ml-2 text-sm text-slate-700">Male</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value="Female"
                              checked={formik.values.gender === "Female"}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="form-radio h-4 w-4 text-pink-600"
                            />
                            <span className="ml-2 text-sm text-slate-700">Female</span>
                          </label>
                        </div>
                        {formik.touched.gender && formik.errors.gender && (
                          <div className="text-pink-600 text-xs mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {formik.errors.gender}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Religion
                    </label>
                    <div className="mt-1 flex space-x-4 bg-white border border-slate-300 rounded-lg p-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="religion"
                          value="Islam"
                          checked={formik.values.religion === "Islam"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="form-radio h-4 w-4 text-pink-600"
                        />
                        <span className="ml-2 text-sm text-slate-700">Islam</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="religion"
                          value="Christianity"
                          checked={formik.values.religion === "Christianity"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="form-radio h-4 w-4 text-pink-600"
                        />
                        <span className="ml-2 text-sm text-slate-700">Christianity</span>
                      </label>
                    </div>
                    {formik.touched.religion && formik.errors.religion && (
                      <div className="text-pink-600 text-xs mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {formik.errors.religion}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Profile Photo</h3>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 mb-3 relative">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center border-4 border-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 w-full">
                        <label className="flex justify-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {photoPreview ? 'Change Photo' : 'Upload Photo'}
                          <input
                            type="file"
                            name="photo"
                            accept=".jpg,.jpeg,.png"
                            onChange={handlePhotoChange}
                            className="sr-only"
                          />
                        </label>
                        
                        <div className="text-xs text-slate-500">
                          <p>• JPEG, JPG or PNG format only</p>
                          <p>• File size must be under 1MB</p>
                          <p>• Square ratio recommended</p>
                        </div>
                        
                        {formik.errors.photo && formik.touched.photo && (
                          <div className="text-pink-600 text-xs flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {formik.errors.photo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Origin Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectInput
                    label="State of Origin"
                    name="stateOfOrigin"
                    formik={formik}
                    options={stateList.map((state) => ({
                      value: state.state,
                      label: state.state,
                    }))}
                    onChange={(e) =>
                      handleStateChange("stateOfOrigin", "lgaOfOrigin", e.target.value)
                    }
                  />

                  <SelectInput
                    label="LGA of Origin"
                    name="lgaOfOrigin"
                    formik={formik}
                    options={
                      selectedState("stateOfOrigin")
                        ? selectedState("stateOfOrigin").lgas.map((lga) => ({
                            value: lga,
                            label: lga,
                          }))
                        : []
                    }
                  />
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    label="National Identification Number"
                    name="nin"
                    placeholder="Type NIN"
                    formik={formik}
                  />
                  
                  <FormInput
                    label="Phone Number"
                    name="phoneNumber"
                    placeholder="Type Phone Number"
                    formik={formik}
                  />
                  
                  <FormInput
                    label="Email"
                    name="email"
                    placeholder="Type Email"
                    formik={formik}
                    type="email"
                    disabled={true}
                  />
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Residence Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectInput
                    label="State of Residence"
                    name="stateOfResidence"
                    formik={formik}
                    options={stateList.map((state) => ({
                      value: state.state,
                      label: state.state,
                    }))}
                    onChange={(e) =>
                      handleStateChange(
                        "stateOfResidence",
                        "lgaOfResidence",
                        e.target.value
                      )
                    }
                  />

                  <SelectInput
                    label="LGA of Residence"
                    name="lgaOfResidence"
                    formik={formik}
                    options={
                      selectedState("stateOfResidence")
                        ? selectedState("stateOfResidence").lgas.map((lga) => ({
                            value: lga,
                            label: lga,
                          }))
                        : []
                    }
                  />
                  
                  <FormInput
                    label="Address"
                    name="address"
                    placeholder="Type Address"
                    formik={formik}
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 mt-8 pt-6 flex justify-between items-center">
                <div></div> {/* Empty div for spacing */}
                
                <MyButton 
                  text="Next"
                  type="submit"
                  variant="filled"
                  onClick={() => {}}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  }
                  iconPosition="right"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BioData;
