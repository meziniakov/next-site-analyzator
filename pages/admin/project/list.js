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
} from "antd";
import Layout from "../../../components/admin/layout.admin";
import axios from "axios";
import A from "../../../components/A";
const { TextArea } = Input;

const columns = [
  {
    title: "Тематика",
    dataIndex: "title",
    render: (text, record) => <A href={record._id} text={text} />,
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

export default function Demo() {
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
      .post("http://localhost:5000/api/project", projectData)
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
      .get("http://localhost:5000/api/project/")
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

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      animation={false}
      visible={visible}
      title="Добавить проект"
      okText="Добавить"
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            // console.log("Responce: ", values.keywords.split("\n"));
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          count: 1,
          profitPerVisitor: 0.1,
        }}
      >
        <Form.Item
          name="title"
          label="Тематика сайтов"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите тематику собираемых сайтов!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="keywords"
          label="Ключевые слова"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите ключевые слова!",
            },
          ]}
        >
          <TextArea
            placeholder="Ключевые слова с новой строки"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
        <Form.Item
          name="count"
          label="Страниц выдачи Google"
          className="collection-create-form_last-form-item"
        >
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Form.Item
          name="profitPerVisitor"
          label="Доход на посетителя"
          className="collection-create-form_last-form-item"
        >
          <InputNumber min={0} max={1} step="0.1" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
