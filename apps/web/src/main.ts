import { WebApp } from "./app/WebApp.js";
import "./styles.css";

const root = document.getElementById("app");

if (root === null) {
  throw new Error("Missing #app root");
}

new WebApp(root);
