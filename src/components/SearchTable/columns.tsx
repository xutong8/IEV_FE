import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ValueType } from "@/types";
import { TEXT_VALUE } from "@/constants/valueTypes";
import { scaleLinear } from "d3-scale";

export const columns = (valueType: ValueType, maxAmount: number) => {
  // 数量列的宽度
  const AmountWidth = 140;
  // 数量行的高度
  const AmountHeight = 22;

  const scale = scaleLinear()
    .domain([0, maxAmount])
    .range([5, AmountWidth - 5]);

  return [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 70,
    },
    {
      title: "ImportCountry",
      dataIndex: "importCountry",
      key: "importCountry",
      width: 135,
      render: (importCountry: string) => {
        return (
          <div>
            {importCountry.slice(0, 5)}
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
      title: "ExportCountry",
      dataIndex: "exportCountry",
      key: "exportCountry",
      width: 135,
      render: (exportCountry: string) => {
        return (
          <div>
            {exportCountry.slice(0, 5)}
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
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 130,
      render: (category: string) => {
        return (
          <div>
            {category.slice(0, 5)}
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
          <div>
            Amount
            <Tooltip title="(In thousands current USD)">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        );
      },
      dataIndex: "amount",
      key: "amount",
      width: AmountWidth,
      render: (amount: number) => {
        if (valueType === TEXT_VALUE) {
          return amount;
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
