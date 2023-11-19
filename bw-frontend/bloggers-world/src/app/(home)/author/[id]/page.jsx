"use client";
import "@/app/_css/author.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCheckAuthToken } from "@/app/_utils/checkToken";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Author({ params }) {
  const router = useRouter();
  var [author, setAuthor] = useState({});
  var [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchAuthor();
  }, []);

  function fetchAuthor() {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/get-author/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        var d = new Date(res.data.doj);
        let day = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
        console.log(res)
        var data = {
          name: `${res.data.firstName} ${res.data.lastName}`,
          doj: day,
          bio: res.data.bio,
          dp: res.data.dp
        };

        setAuthor(data);
      })
      .then(
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/fetch-blogreferences/${params.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
          .then((res) => setBlogs(res.data))
          .catch((e)=>console.log())
      )
      .catch((err) => {
        if (err.code == "ERR_BAD_REQUEST") {
          useCheckAuthToken();
          fetchAuthor();
        } else {
          toast.error("Error! Please Try Again", {
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

  function openBlog(id) {
    router.push("/blog/" + id);
  }

  return (
    <div
      className="d-flex flex-column justify-content-start align-items-center mb-2"
      style={{ width: "100%", minHeight: "100vh", marginTop: "4.5rem" }}
    >
      <div
        className="profile-main d-flex flex-column justify-content-center align-items-center pt-4 rounded"
        style={{ backgroundColor: "#242424" }}
      >
        <img
          className="rounded-circle pb-2 profile-pic"
          src={author.dp}
          alt="profile image"
          style={{ objectFit: "cover" }}
        />
        <p className="display-6">{author.name}</p>
        <p className="h5">{author.bio}</p>
        <div className="my-3" style={{ width: "100%" }}>
          <div className="">
            <span className="h5">Joined At: </span>
            <span className="text-warning">{author.doj}</span>
          </div>
          <div className="">
            <span className="text-info">
              http://bloggersworld/author/{params.id}
            </span>
          </div>
        </div>
        <div className="" style={{ width: "100%" }}>
          <p className="h5 my-2">Blogs:</p>
        </div>
        <div className="my-2 rounded" style={{ width: "100%" }}>
          {blogs.map((ele) => {
            var d = new Date(ele.blogupdated);
            let day = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
            return (
              <div
                key={ele.id}
                className="p-3 rounded my-2"
                style={{ backgroundColor: "#080b05", cursor: "pointer" }}
                onClick={() => {
                  openBlog(ele.id);
                }}
              >
                <p className="h4">{ele.blogtitle}</p>
                <p className="text-warning">{day}</p>
                <p>{ele.blogdesc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
