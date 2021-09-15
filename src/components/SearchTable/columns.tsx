import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ValueType } from "@/types";
import { TEXT_VALUE } from "@/constants/valueTypes";
import { scaleLinear } from "d3-scale";
import styles from "./index.less";
import { selectAll } from "d3-selection";

const columns = [
  "year",
  "importCountry",
  "exportCountry",
  "category",
  "amount",
];

export const customColumnsFunc = (valueType: ValueType, maxAmount: number) => {
  // 数量列的宽度
  const AmountWidth = 200;
  // 数量行的高度
  const AmountHeight = 22;

  const scale = scaleLinear()
    .domain([0, maxAmount])
    .range([5, AmountWidth - 5]);

  const handleColumnClick = (cls: string) => {
    const isHovered = JSON.parse(selectAll(`.${cls}`).attr("data-hoverd"));

    if (isHovered) {
      selectAll(`.${cls}`)
        .attr("data-hoverd", false)
        .style("background-color", null);
    } else {
      columns.forEach((column) => {
        selectAll(`.${column}`)
          .attr("data-hoverd", false)
          .style("background-color", null);
      });

      selectAll(`.${cls}`)
        .attr("data-hoverd", true)
        .style("background-color", "#fcf2f2");
    }
  };

  return [
    {
      title: () => {
        return (
          <div
            className={styles.hover}
            onClick={() => handleColumnClick("year")}
          >
            Year
          </div>
        );
      },
      className: "year",
      dataIndex: "year",
      key: "year",
      width: 70,
      fixed: false,
      render: (year: string) => {
        return <div>{year}</div>;
      },
    },
    {
      title: () => {
        return (
          <div
            className={styles.hover}
            onClick={() => handleColumnClick("importCountry")}
          >
            ImportCountry
          </div>
        );
      },
      dataIndex: "importCountry",
      key: "importCountry",
      width: 135,
      fixed: false,
      className: "importCountry",
      render: (importCountry: string) => {
        return (
          <div>
            <span className={styles.tooltipText}>
              {importCountry.slice(0, 5)}
            </span>
            {importCountry.length > 5 ? (
              <Tooltip title={importCountry}>
                <QuestionCircleOutlined />
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <div
            className={styles.hover}
            onClick={() => handleColumnClick("exportCountry")}
          >
            ExportCountry
          </div>
        );
      },
      dataIndex: "exportCountry",
      key: "exportCountry",
      width: 135,
      fixed: false,
      className: "exportCountry",
      render: (exportCountry: string) => {
        return (
          <div>
            <span className={styles.tooltipText}>
              {exportCountry.slice(0, 5)}
            </span>
            {exportCountry.length > 5 ? (
              <Tooltip title={exportCountry}>
                <QuestionCircleOutlined />
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <div
            className={styles.hover}
            onClick={() => handleColumnClick("category")}
          >
            Category
          </div>
        );
      },
      dataIndex: "category",
      key: "category",
      width: 130,
      fixed: false,
      className: "category",
      render: (category: string) => {
        return (
          <div>
            <span className={styles.tooltipText}>{category.slice(0, 5)}</span>
            {category.length > 5 ? (
              <Tooltip title={category}>
                <QuestionCircleOutlined />
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <div
            className={styles.hover}
            onClick={() => handleColumnClick("amount")}
          >
            <span className={styles.tooltipText}>Amount</span>
            <Tooltip title="(In thousands current USD)">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        );
      },
      dataIndex: "amount",
      fixed: "right" as const,
      key: "amount",
      width: AmountWidth,
      className: "amount",
      render: (amount: number) => {
        if (valueType === TEXT_VALUE) {
          return <div>{amount}</div>;
        } else {
          return (
            <div
              style={{
                background: "#cfdce8",
                width: scale(Number(amount)),
                height: AmountHeight,
                borderRadius: 2,
              }}
            />
          );
        }
      },
    },
  ];
};
