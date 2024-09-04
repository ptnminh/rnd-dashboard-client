import React from "react";

const ComingSoon = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f4f4f4",
      flexDirection: "column",
      textAlign: "center",
      fontFamily: "'Arial', sans-serif",
      color: "#333",
    },
    heading: {
      fontSize: "48px",
      marginBottom: "20px",
      color: "#222",
    },
    subheading: {
      fontSize: "24px",
      marginBottom: "10px",
    },
    countdown: {
      fontSize: "18px",
      marginTop: "20px",
    },
    logo: {
      fontSize: "80px",
      marginBottom: "30px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>🚀</div>
      <h1 style={styles.heading}>Coming Soon</h1>
    </div>
  );
};

export default ComingSoon;
