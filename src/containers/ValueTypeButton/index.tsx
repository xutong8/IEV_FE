import React, { CSSProperties, useState } from "react";
import { Button } from "antd";
import { updateValueType } from "../../actions/valueType";
import { connect } from "react-redux";
import { IStore } from "@/reducers";
import { Dispatch } from "redux";

export interface IValueTypeButtonProps {
  handleUpdateValueType: () => void;
  handleTabelClick: () => void;
  style?: CSSProperties;
}

const ValueTypeButton: React.FC<IValueTypeButtonProps> = (props) => {
  const { handleUpdateValueType, handleTabelClick, style = {} } = props;
  const [type, setType] = useState<boolean>(false);
  return (
    <Button
      type="primary"
      size="small"
      onClick={(event) => {
        event.stopPropagation();
        handleTabelClick();
        handleUpdateValueType();
        setType(!type);
      }}
      style={style}
    >
      {type ? "Rect" : "Text"}
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
