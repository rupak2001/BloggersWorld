import React from "react";

export default function Header() {

  function signout(){
    sessionStorage.removeItem("blog")
    sessionStorage.removeItem("blogEdit")
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // window.location.replace('http://localhost:3000/auth/login');
  }
  return (
    <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark" style={{height:"3.5rem",position:"fixed",top:"0",zIndex:"2000",width:"100%"}}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/profile">
          <p className="h4" style={{textDecoration:"line-through"}}>BW</p>
        </a>
        <button
          className="navbar-toggler mb-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse bg-dark" style={{paddingLeft:"1rem"}} id="navbarColor02">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/feed">
                Home
                <span className="visually-hidden">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/editor">
                Create
              </a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="#">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li> */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Auth
              </a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="/profile">
                  Profile
                </a>
                <a className="dropdown-item" href="" onClick={()=>signout()}>
                  Signout
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
