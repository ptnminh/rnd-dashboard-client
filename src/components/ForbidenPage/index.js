import React from "react";

const ForbiddenPage = () => {
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "black",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        color: "#54FE55",
        textShadow: "0px 0px 10px",
        fontSize: "6rem",
        flexDirection: "column",
        fontFamily: "'Press Start 2P', cursive",
        boxSizing: "border-box",
      }}
    >
      <div>403</div>
      <div
        style={{
          fontSize: "1.8rem",
        }}
      >
        Forbidden<span style={blinkStyle}>_</span>
      </div>
    </div>
  );
};

// Define the blink style separately for reusability
const blinkStyle = {
  animation: "blink 1s infinite",
};

export default ForbiddenPage;
