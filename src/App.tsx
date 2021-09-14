import "antd/dist/antd.css";
import BasicLayout from "./components/BasicLayout";
import { projectContext } from "@/context/projectData";
import initProjectData from "@/utils/initProjectData";
import init from "@/utils/init";

init();

function App() {
  return (
    <projectContext.Provider value={initProjectData()}>
      <BasicLayout />
    </projectContext.Provider>
  );
}

export default App;
