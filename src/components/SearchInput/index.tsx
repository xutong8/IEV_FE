import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { Tag, Input, Button } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

export interface ISearchInputProps {
  onSearch?: () => void;
}

const SearchInput: React.FC<ISearchInputProps> = (props) => {
  const { onSearch } = props;

  // 条件数组，初始时为空
  const [conditions, setConditions] = useState<string[]>([]);

  // 输入框是否显示
  const [inputVisible, setInputVisible] = useState<boolean>(false);

  // 输入框的默认值
  const [inputValue, setInputValue] = useState<string>("");

  // input ref
  const inputRef = useRef<Input>(null);

  // 处理Tag关闭的回调
  const handleTagClose = (removedCondition: string) => {
    const newConditions = conditions.filter(
      (condition) => condition !== removedCondition
    );
    setConditions(newConditions);
  };
  // 添加Tag
  const handleAddCondition = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  // 处理Input文本框内容变更
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  // 文本框内容添加完毕，重设一些状态
  const handleInputConfirm = () => {
    const newConditions = [...conditions];
    if (inputValue && !conditions.includes(inputValue)) {
      newConditions.push(inputValue);
    }
    setConditions(newConditions);
    setInputVisible(false);
    setInputValue("");
  };

  // 处理Search事件
  const handleSearch = () => {
    onSearch?.();
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          {conditions.map((condition: string, index: number) => {
            return (
              <span key={index} style={{ display: "inline-block" }}>
                <Tag
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    handleTagClose(condition);
                  }}
                >
                  {condition}
                </Tag>
              </span>
            );
          })}
          {inputVisible && (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{ width: 72 }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag onClick={handleAddCondition}>
              <PlusOutlined /> New Condition
            </Tag>
          )}
        </div>
        <div className={styles.searchRight}>
          <Button icon={<SearchOutlined />} onClick={handleSearch} />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
