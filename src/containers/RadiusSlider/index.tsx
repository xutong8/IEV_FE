import React from "react";
import styles from "./index.less";
import Slider from "antd/lib/slider";
import { IStore } from "@/reducers";
import { Dispatch } from "redux";
import { changeRadius } from "@/actions/radius";
import { connect } from "react-redux";

export interface IRadiusSliderProps {
  radius: number;
  handleRadiusChange: (newRadius: number) => void;
}

const RadiusSlider: React.FC<IRadiusSliderProps> = (props) => {
  const { radius, handleRadiusChange } = props;
  return (
    <Slider
      style={{ width: 200 }}
      min={8}
      max={20}
      value={radius}
      onChange={handleRadiusChange}
    />
  );
};

const mapStateToProps = (state: IStore) => {
  const { radius } = state;
  return {
    radius,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    handleRadiusChange: (newRadius: number) => {
      dispatch(changeRadius(newRadius));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RadiusSlider);
