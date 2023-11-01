import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import IconBtn from "./IconBtn";
import { useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { toast } from "react-toastify";
import { css } from "@emotion/react"; // for styling the spinner
import { BeatLoader } from "react-spinners"; //

const libraries = ["places"];
const Board = ({ board, showJobModal, setShowJobModal }) => {
  const color = board.color;
  const text = board.title;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    setError,
    reset, // Destructure reset here
  } = useForm();
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setValue("phoneNumber", value); // sets value for react-hook-form
    if (!/^(\+)?[0-9]{10,15}$/.test(value)) {
      setError("phoneNumber", {
        type: "manual",
        message: "Please enter a valid phone number.",
      });
    } else {
      setError("phoneNumber", {
        type: "manual",
        message: "",
      });
    }
  };
  useEffect(() => {
    register("phoneNumber", {
      required: "Please enter your phone number.",
      pattern: {
        value: /^(\+)?[0-9]{10,15}$/,
        message: "Please enter a valid phone number.",
      },
    });
  }, [register]);
  const onSubmit = async (data) => {
    // await getUserDetails(data)
    data.jobTitle = text;
    console.log("Data for my form ", data);
    // Show loader using toast
    const toastId = toast.info(
      <div className="flex items-center space-x-3">
        <BeatLoader
          color={"#D33852"}
          loading={true}
          css={css`
            display: block;
            margin: 0 auto;
          `}
          size={15}
        />
        <span>Processing...</span>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      }
    );

    try {
      const response = await axios.post(
        "https://jobabbackend.onrender.com/api/v1/apply",
        data
      );
      console.log(response);
      // Close the loader toast
      toast.dismiss(toastId);

      if (response.data.success === true) {
        toast.success("You registered successfully");
      } else {
        toast.error("Sorry our servers are down currently");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An error occurred!");
    } finally {
      setShowJobModal(false);
      reset();
      setPhone("");
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAbDLor5DBBfrNKD0FmiRR8PU1zeSPoD6E", // Replace with your Google Maps API Key
    libraries,
  });

  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    register("streetAddress");
  }, [register]);

  const streetAddressValue = watch("streetAddress", "");

  useEffect(() => {
    // If the input value is empty or doesn't exist, clear predictions
    if (isLoaded && (!streetAddressValue || streetAddressValue.trim() === "")) {
      setPredictions([]);
      return;
    }

    // Else, if there's a valid streetAddressValue, fetch the predictions
    if (isLoaded && streetAddressValue && streetAddressValue.trim() !== "") {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: streetAddressValue,
          location: new window.google.maps.LatLng(20.5937, 78.9629), // Central point of India
          radius: 2500000, // Roughly covers India's width
          componentRestrictions: { country: "IN" },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const formattedAddresses = predictions.map(
              (pred) => pred.description
            );
            setPredictions(formattedAddresses);
          }
        }
      );
    }
  }, [streetAddressValue, isLoaded]);

  return (
    <>
      <div
        className={`${
          showJobModal ? "blur-md" : "blur-0"
        } relative flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row border-[1px] border-gray-200 items-center  justify-between ">
          <div className="flex flex-row items-center gap-[1rem]">
            <div
              className={`w-[80px] h-[80px] `}
              style={{ backgroundColor: color }}
            ></div>
            <div>{text}</div>
          </div>

          <div className="mr-2 cursor-pointer">
            <button
              className="self-end bg-[#D33852] text-white items-center px-[16px] py-[13px] gap-[8px] font-semibold duration-300 hover:scale-90 rounded-[8px]"
              onClick={() => setShowJobModal(true)}
            >
              Apply Now!!
            </button>
          </div>
        </div>
      </div>
      {showJobModal && (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
          <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-white ">
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
              <p className="text-xl font-semibold text-white font-walsheim">
                Your Contact Details
              </p>
              <button onClick={() => setShowJobModal(false)}>
                <RxCross2 className="text-2xl text-white" />
              </button>
            </div>
            <div className="p-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 flex flex-col items-center"
              >
                <div className="flex  py-3  w-11/12 flex-col space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-darkblue text-sm font-walsheimMed font-[600]"
                  >
                    Your Full Name <sup className="text-pink-200">*</sup>
                  </label>
                  <input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName", { required: true })}
                    className="form-style2 w-full"
                  />
                  {errors.fullName && (
                    <span className="ml-2 text-sx tracking-wide text-pink-200">
                      Please add your full name.
                    </span>
                  )}
                </div>
                <div className="flex py-3 w-11/12 justify-between gap-[10px] items-center flex-col ss:flex-row ">
                  <div className="w-full ss:w-[50%] ss:h-[100px]">
                    <label
                      htmlFor="fullName"
                      className="text-darkblue text-sm  font-walsheimMed font-[600]"
                    >
                      Your Phone Number <sup className="text-pink-200">*</sup>
                    </label>

                    <PhoneInput
                      country={"in"}
                      id="phoneNumber"
                      value={watch("phoneNumber")}
                      onChange={handlePhoneChange}
                      placeholder="Enter your phone number"
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                        placeholder: "Enter your phone number",
                        className: "form-style2  w-full !pl-10",
                      }}
                    />
                    {errors.phoneNumber && (
                      <p className="ml-2 text-sx tracking-wide text-pink-200">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full ss:w-[50%] ss:h-[100px]">
                    <label
                      htmlFor="email"
                      className="text-darkblue text-sm  font-walsheimMed font-[600]"
                    >
                      Your Email<sup className="text-pink-200">*</sup>
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: true,
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Please enter a valid email address.",
                        },
                      })}
                      className="form-style2 w-full"
                    />
                    {errors.email && (
                      <p className="ml-2  text-sx tracking-wide text-pink-200">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-11/12  flex-col space-y-2">
                  <label
                    htmlFor="streetAddress"
                    className="text-darkblue text-sm font-walsheimMed font-[600]"
                  >
                    Your Street Address <sup className="text-pink-200">*</sup>
                  </label>
                  {isLoaded ? (
                    <div>
                      <input
                        id="streetAddress"
                        placeholder="Enter your street address"
                        {...register("streetAddress", { required: true })}
                        className="form-style2 w-full"
                      />
                      {predictions.length > 0 && (
                        <ul
                          style={{
                            border: "1px solid #e0e0e0", // Softened border
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Lighter shadow
                            borderRadius: "5px", // Rounded corners
                            backgroundColor: "#ffffff", // Background color
                            padding: "10px", // Padding for spacing
                            maxHeight: "200px", // Limiting height
                            overflowY: "auto", // Scroll if too many predictions
                          }}
                        >
                          {predictions.map((prediction, idx) => (
                            <li
                              key={idx}
                              onClick={() => {
                                setValue("streetAddress", prediction);
                                setPredictions([]); // Clear predictions once an address is selected
                              }}
                              style={{
                                padding: "8px 12px", // Padding for each list item
                                borderBottom: "1px solid #f0f0f0", // Border for visual separation
                                cursor: "pointer", // Pointer cursor on hover
                                transition: "background-color 0.2s", // Transition effect
                                ":hover": {
                                  backgroundColor: "#f6f6f6", // Background color on hover
                                },
                              }}
                            >
                              {prediction}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <input
                      id="streetAddress"
                      placeholder="Enter your street address"
                      {...register("streetAddress", { required: true })}
                      className="form-style2 w-full"
                    />
                  )}
                </div>

                {/* last two buttons */}
                <div className="mt-6 w-11/12 flex justify-end gap-x-2">
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="flex cursor-pointer gap-x-2 items-center rounded-md bg-richblack-300 text-richblack-900 font-semibold hover:scale-95 transition-all duration-300 py-[8px] px-[20px]"
                  >
                    Cancel
                  </button>
                  <IconBtn text="Save" />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
