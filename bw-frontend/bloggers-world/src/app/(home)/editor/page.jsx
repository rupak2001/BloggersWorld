"use client";
import EditorToolbar from "@/app/_components/editorToolbar";
import React, { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { WithContext as ReactTags } from "react-tag-input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCheckAuthToken } from "@/app/_utils/checkToken";

export default function Editor() {
  var router = useRouter();
  var heading = useRef();
  var desc = useRef();
  var blog = useRef();
  var timeToRead = useRef();
  var [category, setCategory] = useState("");

  var categories = [
    { id: "1", name: "action" },
    { id: "2", name: "adventure" },
    { id: "3", name: "educational" },
    { id: "4", name: "abstract" },
    { id: "5", name: "technology" },
  ];

  const [categoriesIni, setCategories] = useState([]);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  const [tags, setTags] = React.useState([]);

  useEffect(() => {
    useCheckAuthToken();
    if (sessionStorage.getItem("blog")) {
      var data = JSON.parse(sessionStorage.getItem("blog"));
      heading.current.value = data.title;
      desc.current.value = data.desc;
      blog.current.value = data.content;
      timeToRead.current.value = data.timetoread;
      data.category == "" ? setCategory("action") : setCategory(data.category);

      var tagsload = [];
      data.tags.map((ele) => {
        tagsload.push({ id: ele, text: ele });
      });
      setTags(tagsload);
    } else {
      setCategory(categories[0].name);
    }

    setCategories(
      categories.map((ele) => {
        const id = ele.id;
        const name = ele.name;
        return (
          <li key={Math.random()}>
            <a
              className="dropdown-item"
              id={id}
              href="#"
              onClick={() => {
                setCategory(name);
              }}
            >
              {name}
            </a>
          </li>
        );
      })
    );

    // document.addEventListener("keydown", (e) => {
    //   if (e.ctrlKey && e.key === "s") {
    //     e.preventDefault();
    //     saveLocally();
    //   }
    // });
  }, []);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  function saveLocally() {
    var tagList = [];

    tags.forEach((element) => {
      tagList.push(element.text);
    });

    try {
      var jsonFile = {
        title: heading.current.value,
        desc: desc.current.value,
        content: blog.current.value.replace(/\ /g, " "),
        // content:blog.current.value,
        category: category,
        isPublished: false,
        timetoread: timeToRead.current.value + " read",
        tags: tagList,
      };
      sessionStorage.setItem("blog", JSON.stringify(jsonFile));
    } catch (e) {}

    toast.success("Blog Saved Temporarily", {
      toastId: "success1",
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    toast.info("Please save your blog as draft \n to avoid losing your blog", {
      toastId: "success2",
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function saveBlog(status) {
    var tagList = [];

    tags.forEach((element) => {
      tagList.push(element.text);
    });

    var jsonFile = {
      title: heading.current.value,
      desc: desc.current.value,
      content: blog.current.value.replace(/\ /g, " "),
      category: category,
      timetoread: timeToRead.current.value + " read",
      tags: tagList,
    };

    if (status == 0) jsonFile["isPublished"] = false;
    else if (status == 1) jsonFile["isPublished"] = true;

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/save`,
        jsonFile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        var text = "";
        if (status == 0) text = "Blog Saved As Draft";
        if (status == 1) text = "Blog Published Successfully";

        toast.success(text, {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        sessionStorage.setItem("blog", JSON.stringify(jsonFile));
      })
      .catch((e) => {
        toast.error("Please Try Again", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        className="container-fluid editor-main"
        style={{ marginTop: "4rem" }}
      >
        <EditorToolbar />
        <div
          className="mt-1 editor-inner"
          style={{
            height: "80vh",
            overflowY: "auto",
            overflowX: "unset",
          }}
        >
          <TextareaAutosize
            className="px-3 py-4 mt-4 mb-1 rounded editor-inner-element"
            id=""
            placeholder="Enter Heading"
            minRows="2"
            style={{ fontSize: "xx-large" }}
            ref={heading}
          />
          <TextareaAutosize
            className="px-3 py-4 mb-1 rounded editor-inner-element"
            id=""
            placeholder="Enter Short Description about your post"
            minRows="2"
            style={{ fontSize: "large" }}
            ref={desc}
          />
          <div
            className="px-3 py-2 mb-1 rounded editor-inner-element category-tag-toolbar"
            style={{}}
          >
            <div
              className="btn-group"
              style={{ height: "2.5rem", marginRight: "1rem" }}
            >
              <button
                type="button"
                className="btn btn-secondary dropdown-toggle category-button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {category}
              </button>
              <ul className="dropdown-menu">{categoriesIni}</ul>
            </div>
            <div>
              <ReactTags
                placeholder=" enter tags"
                className="rounded"
                tags={tags}
                //   suggestions={suggestions}
                delimiters={delimiters}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                //   handleDrag={handleDrag}
                //   handleTagClick={handleTagClick}
                inputFieldPosition="top"
                autocomplete
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              style={{ height: "2rem" }}
              className="form-control bg-dark text-white px-3 py-4 mb-1 rounded editor-inner-element"
              id="exampleFormControlInput1"
              ref={timeToRead}
              placeholder="Time to read eg. 1 hour , 30 minutes"
            />
          </div>
          <TextareaAutosize
            className="px-3 py-4 my-3 rounded editor-inner-element"
            id="editor"
            placeholder="This a markdown supported editor, 
          please write your blog in markdown format"
            minRows="15"
            ref={blog}
            style={{ fontSize: "large" }}
          />
        </div>
      </div>
      <div
        className="save my-3 d-flex flex-row justify-content-end flex-wrap "
        style={{ width: "100%" }}
      >
        <button
          className="btn btn-info"
          onClick={() => {
            saveLocally();
            router.push("/preview/1");
          }}
        >
          Preview{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="currentColor"
            className="bi bi-eye-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          </svg>
        </button>
        <button className="btn btn-warning mx-3" onClick={() => saveBlog(0)}>
          Save as Draft{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="currentColor"
            className="bi bi-floppy-fill"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5v-13Z" />
            <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V16Zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V0ZM9 1h2v4H9V1Z" />
          </svg>
        </button>
        <button
          className="btn btn-success publish-button"
          onClick={() => saveBlog(1)}
        >
          Publish{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="currentColor"
            className="bi bi-pencil-square"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
