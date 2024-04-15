import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { Context } from '../store/appContext';


export const Profile = () => {
  const { store, actions } = useContext(Context);

  return (
    !store.user ? <Navigate to="/" /> :
      <div className="d-flex justify-content-center">
        <div className="container py-5">
          <div className="row"></div>
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" 
                className="rounded-circle img-fluid" style={{ width: "150px" }}/>
                <h5 className="card-title mt-2">{store.user.nick_name}</h5>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">NickName</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{store.user.nick_name}</p>
                  </div>
                </div>
                <hr></hr>
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">Email: {store.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      




    // <div>
    //   <div className="card d-flex align-center" style={{ width: "18rem" }}>
    //     <div className="card-body">
    //       <h5 className="card-title">{store.user.nick_name}</h5>
    //       <p className="card-text">Email: {store.user.email}</p>
    //       <p className="card-text">ID: {store.user.id}</p>
    //     </div>
    //   </div>
    // </div>

  );

}