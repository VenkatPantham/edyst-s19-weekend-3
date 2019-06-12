import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <App
    appId={"dc7f31dd7f825257c785c19af12b47eed45974963d20ced5d5e617c59ace6faf"}
    baseUrl={"https://api.unsplash.com/photos/curated"}
  />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
