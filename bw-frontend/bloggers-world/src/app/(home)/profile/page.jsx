"use client";
import "@/app/_css/author.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCheckAuthToken } from "@/app/_utils/checkToken";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function Profile() {
  const router = useRouter();
  var [author, setAuthor] = useState({});
  var [blogs, setBlogs] = useState({ published: [], draft: [] });

  useEffect(() => {
    useCheckAuthToken();
  }, []);

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
        var d = new Date(res.data.doj);
        let day = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

        var data = {
          id: res.data.id,
          name: `${res.data.firstName} ${res.data.lastName}`,
          doj: day,
          bio: res.data.bio,
          dp: res.data.dp,
        };

        setAuthor(data);
        return res.data;
      })
      .then((data) => {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-blogs?id=${data.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
          .then((res) => {
            var published = [];
            var draft = [];
            res.data.map((ele) => {
              if (ele.isPublished == true) published.push(ele);
              else draft.push(ele);
            });
            setBlogs({ published: published, draft: draft });
          })
          .catch((e) => console.log());
      })
      .catch((err) => {
        if (err.code == "ERR_BAD_REQUEST") {
          useCheckAuthToken();
          fetchUserProfile();
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

  function editBlog(id) {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/get-blog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        var json = {
          id: res.data.id,
          title: res.data.blogtitle,
          desc: res.data.blogdesc,
          content: res.data.blogcontent.replace(/\ /g, " "),
          category: res.data.blogcategory.category,
          timetoread: res.data.timetoread,
          tags: res.data.tags,
        };
        sessionStorage.setItem("blogEdit", JSON.stringify(json));
      })
      .then(() => {
        router.push("/edit-blog");
      });
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
        <div
          className="d-flex justify-content-end align-items-end"
          style={{ width: "100%" }}
        >
          <button
            className="btn btn-dark"
            onClick={() => router.push("/edit-profile")}
          >
            Edit profile
          </button>
        </div>
        <img
          className="rounded-circle pb-2 profile-pic"
          src={author.dp}
          alt="profile image"
          style={{ objectFit: "cover" }}
        />
        <p className="display-6">{author.name} </p>
        <p className="h5">{author.bio}</p>

        <div className="my-3" style={{ width: "100%" }}>
          <div className="">
            <span className="h5">Joined At: </span>
            <span className="text-warning">{author.doj}</span>
          </div>
        </div>
        <div className="" style={{ width: "100%" }}>
          <p className="h5 my-2">Blogs:</p>
        </div>
        <div className="my-2 rounded" style={{ width: "100%" }}>
          <Tabs>
            <TabList>
              <Tab>Published</Tab>
              <Tab>Draft</Tab>
            </TabList>

            <TabPanel>
              <div
                className="my-2 rounded"
                style={{ width: "100%", maxHeight: "75vh", overflowY: "auto" }}
              >
                {blogs.published.length == 0 ? (
                  <div className="text-success my-2" style={{ width: "100%" }}>
                    Nothing to Show
                  </div>
                ) : (
                  blogs.published.map((ele) => {
                    var d = new Date(ele.blogupdated);
                    let day =
                      d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
                    return (
                      <div
                        key={ele.id}
                        className="p-3 rounded my-2"
                        style={{
                          backgroundColor: "#080b05",
                        }}
                      >
                        <p className="h4">{ele.blogtitle}</p>
                        <p className="text-warning">{day}</p>
                        <p>{ele.blogdesc}</p>
                        <div>
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              editBlog(ele.id);
                            }}
                          >
                            Edit 🖊
                          </button>
                          <button
                            className="btn btn-info mx-2"
                            onClick={() => {
                              openBlog(ele.id);
                            }}
                          >
                            View 👁️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabPanel>

            <TabPanel>
              <div
                className="my-2 rounded"
                style={{ width: "100%", maxHeight: "75vh", overflowY: "auto" }}
              >
                {blogs.draft.length == 0 ? (
                  <div className="text-success my-2" style={{ width: "100%" }}>
                    Nothing to Show
                  </div>
                ) : (
                  blogs.draft.map((ele) => {
                    var d = new Date(ele.blogupdated);
                    let day =
                      d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
                    return (
                      <div
                        key={ele.id}
                        className="p-3 rounded my-2"
                        style={{
                          backgroundColor: "#080b05",
                        }}
                      >
                        <p className="h4">{ele.blogtitle}</p>
                        <p className="text-warning">{day}</p>
                        <p>{ele.blogdesc}</p>
                        <div>
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              editBlog(ele.id);
                            }}
                          >
                            Edit 🖊
                          </button>
                          <button
                            className="btn btn-info mx-2"
                            onClick={() => {
                              openBlog(ele.id);
                            }}
                          >
                            View 👁️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
