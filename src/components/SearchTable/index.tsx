import React from "react";
import styles from "./index.less";
import { Select, Button, Table } from "antd";
import dataSource from "./data.json";
import SearchItem from "./SearchItem";
import { ValueType } from "@/types";
import { columns } from "./columns";

const { Option } = Select;

export interface ISearchTableProps {
  valueType: ValueType;
}

const SearchTable: React.FC<ISearchTableProps> = (props) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const { valueType } = props;

  return (
    <div className={styles["search_table"]}>
      <div className={styles["search_top"]}>
        <Select
          defaultValue="lucy"
          onChange={handleChange}
          style={{ width: "80%" }}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
        <Button type="primary" style={{ width: "80%", marginTop: 15 }}>
          Primary
        </Button>
      </div>
      <div className={styles["search_list"]}>
        <div className={styles["search_container"]}>
          <Table
            columns={columns}
            dataSource={dataSource.data}
            rowKey={(record) => record.id}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTable;
