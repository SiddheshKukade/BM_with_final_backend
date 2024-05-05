import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getInitConfig } from "@/lib/api";
import {APP_STORE, maskAtom, templateAtom} from "@/components/search/atoms.ts";
import { Provider } from "jotai";

const template = await getInitConfig();

APP_STORE.set(templateAtom, template);
APP_STORE.set(maskAtom, template.default);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Provider store={APP_STORE}>
          <App />
      </Provider>
  </React.StrictMode>,
);
