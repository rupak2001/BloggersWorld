import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useCheckAuthToken } from "../_utils/checkToken";

export default function SearchBar({ getdata, fetchByTag }) {
  var [searchItems, setSearchItems] = useState([]);
  var [tags, setTags] = useState([]);
  useEffect(() => {
    fetchTags()
  }, []);

  function fetchTags() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/get-tag-suggestion`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        if (err.code == "ERR_BAD_REQUEST") {
          useCheckAuthToken();
          fetchTags();
        } else {
          toast.error("Error! Please Try Again", {
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
        }
      });
  }

  // useState([
  //   {
  //     id: 0,
  //     name: "Cobol",
  //   },
  //   {
  //     id: 1,
  //     name: "JavaScript",
  //   },
  //   {
  //     id: 2,
  //     name: "Basic",
  //   },
  //   {
  //     id: 3,
  //     name: "PHP",
  //   },
  //   {
  //     id: 4,
  //     name: "Java",
  //   },
  // ]);

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/search?search=${string}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        var json = [];
        res.data.map((ele) => {
          json.push({ id: ele.id, name: ele.firstName + " " + ele.lastName });
        });
        setSearchItems(json);
      })
      .catch((err) => console.log(err));
  };

  const handleOnSelect = (item) => {
    document.getElementById("closeButton").click();
    getdata(1, item.id);
  };

  function filterByCategory(id) {
    document.getElementById("closeButton").click();
    getdata(2, id);
  }

  function filterByTagName(tagname) {
    document.getElementById("closeButton").click();
    getdata(3, tagname);
  }

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        style={{ marginTop: "4rem" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Explore
            </h5>
            <button
              id="closeButton"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <ReactSearchAutocomplete
              items={searchItems}
              onSearch={handleOnSearch}
              onSelect={handleOnSelect}
              autoFocus
              placeholder="Search for Authors"
              styling={{
                borderRadius: "0.5rem",
              }}
            />
            <p className="h5 mb-2 mt-3">Categories</p>
            <div
              className="d-flex flex-row justify-content-start align-items-start my-3 flex-wrap"
              style={{ width: "100%" }}
            >
              <button
                type="button"
                className="m-2 btn btn-info"
                onClick={() => filterByCategory(1)}
              >
                Action ⚡️
              </button>
              <button
                type="button"
                className="m-2 btn btn-success"
                onClick={() => filterByCategory(2)}
              >
                Adventure 🌊
              </button>
              <button
                type="button"
                className="m-2 btn btn-info"
                onClick={() => filterByCategory(4)}
              >
                Abstract 🐉
              </button>
              <button
                type="button"
                className="m-2 btn btn-success"
                onClick={() => filterByCategory(3)}
              >
                Educational 📚
              </button>
              <button
                type="button"
                className="m-2 btn btn-info"
                onClick={() => filterByCategory(5)}
              >
                Technology 💻
              </button>
            </div>
            <p className="h5 mb-2 mt-3">Trending discussions</p>
            <div
              className="d-flex flex-row justify-content-start align-items-start my-3 flex-wrap"
              style={{ width: "100%" }}
            >
              {tags.map((ele, index) => {
                return (
                  index < 15 && (
                    <a
                      key={Math.random()}
                      href="#"
                      className="mx-2"
                      onClick={() => {
                        filterByTagName(ele);
                      }}
                    >
                      <span className="badge bg-secondary h5">{ele}</span>
                    </a>
                  )
                );
              })}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
