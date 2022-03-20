import React, { useEffect, useState } from "react";
import {
  Tag,
  Table,
  Form,
  Modal,
  InputNumber,
  Input,
  Button,
  Divider,
  Space,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Layout from "../../components/admin/layout.admin";
import axios from "axios";
import A from "../../components/A";
import CollectionCreateForm from "../../components/admin/buttonModal";

const { TextArea } = Input;

const columns = [
  {
    title: "Тематика",
    dataIndex: "title",
    render: (text, record) => <A href={"/project/" + record._id} text={text} />,
  },
  {
    title: "Пользователь",
    dataIndex: "keywords",
    render: (keywords) => (
      <>
        {keywords.map((keyword) => (
          <Tag color="blue" key={keyword}>
            {keyword}
            <br />
          </Tag>
        ))}
      </>
    ),
  },
  {
    title: "Доходность",
    dataIndex: "profitPerVisitor",
  },
  {
    title: "Действия",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <A href={"/project/edit/" + record._id} text={<EditOutlined />} />
        <A href={"/project/edit/" + record._id} text={<DeleteOutlined />} />
      </Space>
    ),
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

export default function Project() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [projects, setProjects] = useState([]);
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    const projectData = {
      title: values.title,
      keywords: values.keywords.split("\n"),
      count: values.count,
      profitPerVisitor: values.profitPerVisitor,
    };
    console.log(projectData);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_SERVER}/api/project/`, projectData)
      .then((res) =>
        res.data.status === "error"
          ? message.error(res.data.message)
          : message.success(res.data.message)
      )
      .catch((e) => alert(e.message, "error"));
    setVisible(false);
  };
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_SERVER}/api/project/`)
      .then((response) => {
        setProjects(response.data);
        // console.log("Data", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Layout title="Проекты">
      <div>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          Добавить проект
        </Button>
        <CollectionCreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </div>
      <Divider />
      <Table
        rowKey={"_id"}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={projects}
      />
    </Layout>
  );
}
