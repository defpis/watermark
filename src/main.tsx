import { createRoot } from "react-dom/client";
import { App } from "./App";

const rootElement = document.querySelector("#root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  throw new Error("没有找到挂载DOM节点");
}
