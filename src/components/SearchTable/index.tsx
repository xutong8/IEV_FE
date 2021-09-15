import React, { useMemo, useState } from "react";
import styles from "./index.less";
import { Table, TableColumnType } from "antd";
import { ValueType } from "@/types";
import { columns } from "./columns";
import { ITableCountry, processTableData } from "@/utils/processTableData";
import SearchInput from "../SearchInput";
import { TableRowSelection } from "antd/lib/table/interface";

export interface ISearchTableProps {
  valueType: ValueType;
}

// TODO: 支持valueType

const SearchTable: React.FC<ISearchTableProps> = (props) => {
  const { valueType } = props;

  const [dataSource, setDataSource] = useState<ITableCountry[]>(
    processTableData()
  );

  const maxAmount = useMemo(
    () => Math.max(...dataSource.map((item) => item.amount)),
    [dataSource]
  );

  // 处理搜索逻辑
  const handleSearch = (conditions: string[]) => {
    if (conditions && conditions.length === 0) {
      setDataSource(processTableData());
      return;
    }

    const newDataSource = dataSource.slice();
    const filteredDataSource = newDataSource.filter((item) => {
      return conditions.every((condition) => {
        return (
          condition === String(item.year) ||
          condition === item.exportCountry ||
          condition === item.importCountry ||
          condition === item.category
        );
      });
    });
    setDataSource(filteredDataSource);
  };

  return (
    <div className={styles["search_table"]}>
      <div className={styles["search_top"]}>
        <SearchInput onSearch={handleSearch} />
      </div>
      <div className={styles["search_list"]}>
        <div className={styles["search_container"]}>
          <Table
            columns={columns(valueType, maxAmount)}
            dataSource={dataSource}
            rowKey={(record) => record.id}
            pagination={{
              showSizeChanger: false,
              pageSize: 12,
            }}
            scroll={{
              x: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTable;
