import React from "react";

const HomeTemplate = props => {
  const { user } = props;
  return (
    <div>
      <div
        className="card-panel"
        style={{ backgroundImage: `url(${"/images/home_bg.jpg"})` }}
      >
        <div className="container" style={{ paddingBottom: "0.5%" }}>
          <h1 className="display-3">
            {" "}
            <strong>
              <span style={{ color: "white" }}>Anuência Digital</span>{" "}
            </strong>{" "}
          </h1>
          <h6 style={{ color: "white", fontWeight: "500" }}>
            Versão 1.6.3 - 13/01/2020
          </h6>
          <br />
          <h4 style={{ color: "white", fontWeight: "500" }}>
            Olá, {user.name} {user.surName}!
          </h4>
        </div>
      </div>
      <div className="container">
        <div className="row">{props.children}</div>
      </div>
    </div>
  );
};

export default HomeTemplate;
