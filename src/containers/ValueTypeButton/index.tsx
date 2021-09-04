import React from "react";
import { Button } from "antd";
import { updateValueType } from "../../actions/valueType";
import { connect } from "react-redux";
import { IStore } from "@/reducers";
import { Dispatch } from "redux";

export interface IValueTypeButtonProps {
  handleUpdateValueType: () => void;
}

const ValueTypeButton: React.FC<IValueTypeButtonProps> = (props) => {
  const { handleUpdateValueType } = props;
  return (
    <Button type="primary" onClick={handleUpdateValueType}>
      修改ValueType
    </Button>
  );
};

const mapStateToProps = (state: IStore) => {
  const { valueType } = state;
  return {
    valueType,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    handleUpdateValueType: () => {
      dispatch(updateValueType());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ValueTypeButton);
