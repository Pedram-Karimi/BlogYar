import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./helper/ScrollToTop";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <BrowserRouter basename={"/blogyar"}>
    <ScrollToTop />
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);
