import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./styles/global.scss";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom"; 

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter basename="/Social_Media_Frontend/"> 
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
