import React from "react"

const Footer = () => {
  return (
    <footer className="my-12 text-center">
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.org">Gatsby framework</a> by {" "}
      <a href="https://www.linkedin.com/in/koushik-aravalli/">Koushik Aravalli</a>
    </footer>
  )
}

export default Footer
