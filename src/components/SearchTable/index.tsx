import React, { useMemo } from "react";
import styles from "./index.less";
import { Select, Button, Table } from "antd";
import { ValueType } from "@/types";
import { columns } from "./columns";
import { processTableData } from "@/utils/processTableData";
import SearchInput from "../SearchInput";

const { Option } = Select;

export interface ISearchTableProps {
  valueType: ValueType;
}

const SearchTable: React.FC<ISearchTableProps> = (props) => {
  const { valueType } = props;

  const dataSource = useMemo(() => processTableData(), []);

  return (
    <div className={styles["search_table"]}>
      <div className={styles["search_top"]}>
        <SearchInput />
      </div>
      <div className={styles["search_list"]}>
        <div className={styles["search_container"]}>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => record.id}
            pagination={{
              showSizeChanger: false,
              pageSize: 12,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTable;
