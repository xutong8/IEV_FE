import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.less";
import { Table } from "antd";
import { ValueType } from "@/types";
import { columns, customColumnsFunc } from "./columns";
import { ITableCountry } from "@/types/table";
import SearchInput from "../SearchInput";
import { httpRequest } from "@/services";
import Title from "../Title";
import { selectAll } from "d3-selection";
export interface ISearchTableProps {
  valueType: ValueType;
}

const SearchTable: React.FC<ISearchTableProps> = (props) => {
  const { valueType } = props;

  // 数据源
  const [dataSource, setDataSource] = useState<ITableCountry[]>([]);
  // 条件数组
  const [query_conditions, setQueryConditions] = useState<string[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // 获取数据
  const fetchData = () => {
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
  };

  // 每当query_conditions变更时，请求接口
  useEffect(() => {
    fetchData();
  }, [query_conditions]);

  const maxAmount = useMemo(
    () => Math.max(...dataSource.map((item) => item.amount)),
    [dataSource]
  );

  // 处理搜索逻辑
  const handleSearch = (conditions: string[]) => {
    setQueryConditions(conditions);
  };

  // 处理page_size变更时回调
  const handlePageSizeChange = () => {
    columns.forEach((column) => {
      selectAll(`.${column}`)
        .attr("data-hoverd", false)
        .style("background-color", null);
    });
  };
  console.log(tableRef.current?.clientHeight);
  console.log(
    Math.max(Math.floor((tableRef.current?.clientHeight ?? 800) / 55), 20)
  );
  return (
    <div className={styles["search_table"]}>
      <Title title="Source Data"></Title>
      <div className={styles["search_top"]}>
        <SearchInput onSearch={handleSearch} />
      </div>
      <div className={styles["search_list"]} ref={tableRef}>
        <div className={styles["search_container"]}>
          {/* TODO: 当pageNo切换时，需要考虑高亮的问题 */}
          <Table
            columns={customColumnsFunc(valueType, maxAmount)}
            dataSource={dataSource}
            rowKey={(record) => record.id}
            pagination={{
              showSizeChanger: false,
              pageSize: Math.floor(
                (tableRef.current?.clientHeight ?? 800) / 55 - 2
              ),
              size: "small",
              onChange: handlePageSizeChange,
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
