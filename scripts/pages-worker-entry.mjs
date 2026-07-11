import vinextWorker from "../dist/server/index.js";
import { createPagesWorker } from "./pages-worker-shell.mjs";

export default createPagesWorker(vinextWorker);
