import React from "react";

function About() {
  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>About This Poll App</h2>

      <p>
        This is a simple voting application built using React and JSON Server.
        It allows users to create polls and vote on different options.
      </p>

      <p>
        Users must log in before voting to ensure fairness and prevent duplicate votes.
      </p>
    </div>
  );
}

export default About;