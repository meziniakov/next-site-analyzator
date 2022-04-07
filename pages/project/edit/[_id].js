import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/admin/layout.admin";
import axios from "axios";
import { Button, Form, Input, InputNumber, message } from "antd";
const { TextArea } = Input;

export default function Edit() {
  const router = useRouter();
  const { _id } = router.query;
  const [project, setProject] = useState([]);
  const [form] = Form.useForm();

  const onUpdate = (values) => {
    const projectData = {
      title: values.title,
      keywords: values.keywords.split("\n"),
      count: values.count,
      profitPerVisitor: values.profitPerVisitor,
    };
    // console.log(projectData);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_SERVER}/api/project/${_id}`,
        projectData
      )
      .then((res) =>
        res.data.status === "error"
          ? message.error(res.data.message)
          : message.success(res.data.message)
      )
      .catch((e) => alert(e.message, "error"));
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_SERVER}/api/project/${_id}/info`)
      .then((response) => {
        // console.log(response);
        setProject([
          { name: "title", value: response.data.title },
          {
            name: "keywords",
            value: response.data.keywords.join("\n"),
          },
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [_id]);

  return (
    <Layout title={`Project ${_id}`}>
      <Form
        form={form}
        fields={project}
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
        <Button
          type="primary"
          onClick={() =>
            form.validateFields().then((values) => onUpdate(values))
          }
        >
          Submit
        </Button>
      </Form>
    </Layout>
  );
}
