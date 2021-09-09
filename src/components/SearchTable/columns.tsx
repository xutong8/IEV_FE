import { Tooltip } from "antd";
import { QuestionOutlined } from "@ant-design/icons";

export const columns = [
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
              <QuestionOutlined />
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
              <QuestionOutlined />
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
              <QuestionOutlined />
            </Tooltip>
          ) : null}
        </div>
      );
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 140,
  },
];
