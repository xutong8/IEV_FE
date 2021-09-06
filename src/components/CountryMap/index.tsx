import React, { useContext, useMemo } from "react";
import { VectorMap } from "@south-paw/react-vector-maps";
import { projectContext } from "@/context/projectData";
import styles from "./index.less";

export interface ICountryMapProps {
  name: string;
}

const CountryMap: React.FC<ICountryMapProps> = (props) => {
  const { name } = props;

  const projectData = useContext(projectContext);

  const attributes = useMemo(
    () => projectData?.mapData.get(name),
    [projectData, name]
  );

  console.log("a: ", projectData);

  return (
    <div className={styles.countryMap}>
      {attributes && <VectorMap {...attributes} />}
    </div>
  );
};

export default CountryMap;
