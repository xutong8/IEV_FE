import React, { useEffect, useMemo, useState } from "react";
import styles from "./index.less";
import { Table } from "antd";
import { ValueType } from "@/types";
import { customColumnsFunc } from "./columns";
import { ITableCountry } from "@/utils/processTableData";
import SearchInput from "../SearchInput";
import { httpRequest } from "@/services";
export interface ISearchTableProps {
  valueType: ValueType;
}

const SearchTable: React.FC<ISearchTableProps> = (props) => {
  const { valueType } = props;

  // 数据源
  const [dataSource, setDataSource] = useState<ITableCountry[]>([]);
  // 条件数组
  const [query_conditions, setQueryConditions] = useState<string[]>([]);

  // 每当query_conditions变更时，请求接口
  useEffect(() => {
    httpRequest
      .post(
        "/table",
        JSON.stringify({
          query_conditions,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res: any) => {
        setDataSource(res?.data ?? []);
      });
  }, [query_conditions]);

  const maxAmount = useMemo(
    () => Math.max(...dataSource.map((item) => item.amount)),
    [dataSource]
  );

  // 处理搜索逻辑
  const handleSearch = (conditions: string[]) => {
    setQueryConditions(conditions);
  };

  return (
    <div className={styles["search_table"]}>
      <div className={styles["search_top"]}>
        <SearchInput onSearch={handleSearch} />
      </div>
      <div className={styles["search_list"]}>
        <div className={styles["search_container"]}>
          <Table
            columns={customColumnsFunc(valueType, maxAmount)}
            dataSource={dataSource}
            rowKey={(record) => record.id}
            pagination={{
              showSizeChanger: false,
              pageSize: 12,
              size: "small",
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
