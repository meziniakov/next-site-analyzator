import React, { useEffect, useState } from "react";
import {
  Tag,
  Table,
  Form,
  InputNumber,
  Input,
  Button,
  Divider,
  Space,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleTwoTone,
} from "@ant-design/icons";
import Layout from "../../components/admin/layout.admin";
import axios from "axios";
import A from "../../components/A";
import ButtonModal from "../../components/admin/buttonModal";
import { useSession } from "next-auth/react";
import Link from "next/link";
const { TextArea } = Input;

const columns = [
  {
    title: "Тематика",
    dataIndex: "title",
    render: (text, record) => <A href={"/project/" + record._id} text={text} />,
  },
  {
    title: "Ключевые слова",
    dataIndex: "keywords",
    width: 300,
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
    title: "Доменов",
    dataIndex: "countDomains",
  },
  {
    title: "Emails",
    dataIndex: "countEmails",
  },
  {
    title: "Действия",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <Link href={"/"}>
          <a onClick={(e) => handleParser(e, record)}>
            <PlayCircleTwoTone />
          </a>
        </Link>
        <A href={"/project/edit/" + record._id} text={<EditOutlined />} />
        <A href={"/project/delete/" + record._id} text={<DeleteOutlined />} />
      </Space>
    ),
  },
];

const handleParser = (e, project) => {
  e.preventDefault();
  const projectData = {
    projectId: project._id,
    keywords: project.keywords,
    count: project.count,
  };
  // console.log(projectData);
  axios
    .post(`${process.env.NEXT_PUBLIC_API_SERVER}/api/parser/`, projectData)
    .then((res) => {
      if (res.status === 200) {
        message.success(
          `Добавлено новых: ${res.data.countInsert} Добавлено существующих: ${res.data.countUpdate}`
        );
      } else {
        message.error("Ошибка.");
      }
    })
    .catch((e) => message.error("Ошибка. Попробуйте чуть позже"));
};

export default function Project() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  // const [selectedProject, setSelectedProject] = useState([]);

  const onCreate = (values) => {
    const projectData = {
      title: values.title,
      keywords: values.keywords.split("\n"),
      count: values.count,
      profitPerVisitor: values.profitPerVisitor,
    };
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
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Layout title="Проекты">
      <div>
        <Space>
          <Button type="primary" onClick={() => setVisible(true)}>
            Добавить проект
          </Button>
        </Space>
        <ButtonModal
          visible={visible}
          onCreate={onCreate}
          form={form}
          title="Добавить проект"
          okText="Добавить"
          cancelText="Отмена"
          onCancel={() => setVisible(false)}
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
        </ButtonModal>
      </div>
      <Divider />
      <Table
        rowKey={"_id"}
        // rowSelection={{ ...rowSelection }}
        columns={columns}
        dataSource={projects}
        scroll={{ x: 700 }}
      />
    </Layout>
  );
}

// Project.auth = true;
