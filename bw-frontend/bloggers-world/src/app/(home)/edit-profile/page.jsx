"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/app/_css/editor.css";
import { useCheckAuthToken } from "@/app/_utils/checkToken";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget, getCldImageUrl } from "next-cloudinary";

export default function EditProfile() {
  var router = useRouter();
  var id = useRef();
  var firstname = useRef();
  var lastname = useRef();
  var email = useRef();
  var bio = useRef();
  var [dpLink, setDpLink] = useState();

  var oldPassword = useRef();
  var newPassword = useRef();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  function fetchUserProfile() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        email.current.value = res.data.email;
        firstname.current.value = res.data.firstName;
        lastname.current.value = res.data.lastName;
        bio.current.value = res.data.bio;
        id.current = res.data.id;
        oldPassword.current.value = "";
        newPassword.current.value = "";
        setDpLink(res.data.dp);
      })
      .catch((err) => {
        if (err.code == "ERR_BAD_REQUEST") {
          useCheckAuthToken();
          fetchUserProfile();
        } else {
          toast.error("Error! Please Try Again", {
            toastId: "errorIni",
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  }

  function editBasic(e) {
    e.preventDefault();
    var json = {
      id: id.current,
      firstName: firstname.current.value,
      lastName: lastname.current.value,
      email: email.current.value,
      bio: bio.current.value,
      dp:dpLink
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/edit-basic`, json, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        toast.success("Successfully Updated", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((e) => {
        if (e.code == "ERR_BAD_REQUEST") {
          toast.error("Same email-id already exists", {
            toastId: "error1",
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Server Error! Please try again", {
            toastId: "error2",
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  }

  function editPassword(e) {
    e.preventDefault();
    var json = {
      oldPassword: oldPassword.current.value,
      newPassword: newPassword.current.value,
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/change-password`,
        json,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        oldPassword.current.value = "";
        newPassword.current.value = "";

        toast.success("Password Changed Successfully", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((e) => {
        oldPassword.current.value = "";
        newPassword.current.value = "";

        if (e.code == "ERR_BAD_REQUEST") {
          toast.error("Incorrect Old Password", {
            toastId: "error1",
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Server Error! Please try again", {
            toastId: "error2",
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ width: "100%", marginTop: "4rem" }}
    >
      <p className="display-6 mt-4" style={{ textAlign: "left" }}>
        Edit Profile
      </p>
      <div className="profile-editor-main">
        <p className="h5">Change Basic Details</p>
        <form
          className="my-3 p-3 rounded"
          style={{ width: "100%", backgroundColor: "#343434" }}
          onSubmit={(e) => {
            editBasic(e);
          }}
        >
          <div className="d-flex flex-column justify-content-center align-items-center" style={{width:"100%"}}>
            <CldUploadWidget
              uploadPreset="uelcogu7"
              onSuccess={(results) => {
                const url = getCldImageUrl({
                  // width: 400,
                  // height: 500,
                  src: results.info.public_id,
                });
                setDpLink(url);
                // console.log("Public ID", url);
              }}
            >
              {({ open }) => {
                return (
                  <img
                    className="rounded-circle"
                    src={dpLink}
                    alt="dp image"
                    style={{
                      width: "8rem",
                      height: "8rem",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => open()}
                  />
                );
              }}
            </CldUploadWidget>
            <p>Change Dp</p>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Edit Email address
            </label>
            <input
              className="form-control text-black"
              type="email"
              id="exampleFormControlInput1"
              placeholder="name@example.com"
              ref={email}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput2" className="form-label">
              Edit First Name
            </label>
            <input
              className="form-control text-black"
              type="text"
              id="exampleFormControlInput2"
              placeholder=""
              ref={firstname}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput3" className="form-label">
              Edit Last Name
            </label>
            <input
              className="form-control text-black"
              type="text"
              id="exampleFormControlInput3"
              placeholder=""
              ref={lastname}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput4" className="form-label">
              Edit Bio
            </label>
            <textarea
              className="form-control text-black"
              placeholder="bio"
              id="exampleFormControlInput4"
              ref={bio}
            ></textarea>
          </div>
          <button className="btn btn-warning text-black">
            Update{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-cloud-upload-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      <div className="profile-editor-main">
        <p className="h5 mt-4">Change Password</p>
        <form
          className="my-3 p-3 rounded"
          action=""
          style={{ width: "100%", backgroundColor: "#343434" }}
          onSubmit={(e) => editPassword(e)}
        >
          <p>Edit Password </p>
          <div
            className="mb-3 d-flex flex-row justify-content-center align-items-center"
            style={{ width: "90%" }}
          >
            <div className="mx-2">
              <label htmlFor="exampleFormControlInput5" className="form-label">
                Old
              </label>
              <input
                className="form-control text-black"
                type="password"
                id="exampleFormControlInput5"
                placeholder=""
                ref={oldPassword}
                required
              />
            </div>
            <div>
              <label htmlFor="exampleFormControlInput6" className="form-label">
                New
              </label>
              <input
                className="form-control text-black"
                type="password"
                id="exampleFormControlInput6"
                placeholder=""
                ref={newPassword}
                required
              />
            </div>
          </div>
          <button className="btn btn-info text-black">
            Change Password{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              fill="currentColor"
              className="bi bi-key-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
