import React, { useContext, useMemo, CSSProperties } from "react";
import { VectorMap } from "@south-paw/react-vector-maps";
import { projectContext } from "@/context/projectData";
import styles from "./index.less";
import cn from "classnames";

export interface ICountryMapProps {
  name: string;
  large?: boolean;
  style?: CSSProperties;
}

const CountryMap: React.FC<ICountryMapProps> = (props) => {
  const { name, style = {}, large = false } = props;

  const projectData = useContext(projectContext);

  const attributes = useMemo(
    () => projectData?.mapData.get(name),
    [projectData, name]
  );

  return (
    <div
      className={cn({
        [styles.countryMap]: true,
        [styles.large]: large,
      })}
    >
      {attributes && <VectorMap {...attributes} />}
    </div>
  );
};

export default CountryMap;
