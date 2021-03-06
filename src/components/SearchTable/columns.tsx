import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ValueType } from "@/types";
import { TEXT_VALUE } from "@/constants/valueTypes";
import { scaleLinear } from "d3-scale";
import styles from "./index.less";
import { selectAll } from "d3-selection";
import ValueTypeButton from "@/containers/ValueTypeButton";

export const columns = [
  "year",
  "importCountry",
  "exportCountry",
  "industry_category",
  "product",
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
              {importCountry.slice(0, 8)}
            </span>
            {importCountry.length > 8 ? (
              <Tooltip title={importCountry}>...</Tooltip>
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
              {exportCountry.slice(0, 8)}
            </span>
            {exportCountry.length > 8 ? (
              <Tooltip title={exportCountry}>...</Tooltip>
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
            onClick={() => handleColumnClick("industry_category")}
          >
            industryCategory
          </div>
        );
      },
      dataIndex: "industry_category",
      key: "industry_category",
      width: 140,
      fixed: false,
      className: "industry_category",
      render: (industry_category: string) => {
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            <span className={styles.tooltipText}>
              {industry_category.slice(0, 8)}
            </span>
            {industry_category?.length > 8 ? (
              <Tooltip title={industry_category}>...</Tooltip>
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
            onClick={() => handleColumnClick("product")}
          >
            product
          </div>
        );
      },
      dataIndex: "product",
      key: "product",
      width: 140,
      fixed: false,
      className: "product",
      render: (product: string) => {
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            <span className={styles.tooltipText}>{product.slice(0, 5)}</span>
            {product?.length > 5 ? (
              <Tooltip title={product}>...</Tooltip>
            ) : null}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <div className={styles.hover}>
            <ValueTypeButton
              handleTabelClick={() => handleColumnClick("amount")}
              style={{
                marginRight: 2,
              }}
            />
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
