import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form, Input, InputNumber, message } from "antd";
import Layout from "../../../components/admin/layout.admin";
const { TextArea } = Input;

export default function CollectionsPage() {
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
