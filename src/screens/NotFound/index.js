import React from "react";

const Page404 = () => {
  const containerStyle = {
    padding: "40px 0",
    background: "#fff",
    fontFamily: "'Arvo', serif",
    height: "100vh",
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  };

  const fourZeroFourBgStyle = {
    backgroundImage:
      "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
    height: "400px",
    backgroundPosition: "center",
    width: "100%",
  };

  const headerStyle = {
    fontSize: "80px",
  };

  const linkStyle = {
    color: "#fff",
    padding: "10px 20px",
    background: "#39ac31",
    margin: "20px 0",
    display: "inline-block",
    textDecoration: "none",
  };

  const contentBoxStyle = {
    marginTop: "-50px",
  };

  return (
    <section style={containerStyle}>
      <div style={rowStyle}>
        <div style={fourZeroFourBgStyle}>
          <h1 style={headerStyle}>404</h1>
        </div>

        <div style={contentBoxStyle}>
          <h3 style={{ fontSize: "40px" }}>Look like you're lost</h3>

          <p>The page you are looking for is not available!</p>

          <a href="/" style={linkStyle}>
            Go to Home
          </a>
        </div>
      </div>
    </section>
  );
};

export default Page404;
