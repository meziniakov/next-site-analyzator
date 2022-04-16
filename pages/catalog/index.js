import React, { useCallback, useEffect, useState } from "react";
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
  SearchOutlined,
} from "@ant-design/icons";
import Layout from "../../components/admin/layout.admin";
import axios from "axios";
import A from "../../components/A";
import ButtonModal from "../../components/admin/buttonModal";
import { useSession } from "next-auth/react";
import Link from "next/link";
const { TextArea } = Input;

const columns = [];

const getColumnSearchProps = (dataIndex) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={(node) => {
          searchInput = node;
        }}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : "",
  onFilterDropdownVisibleChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.select(), 100);
    }
  },
});

axios.get(`http://localhost:3000/api/catalog`).then((response) => {
  const projects = response.data;
  console.log(projects);
  const keys = Object.keys(projects[0]);
  let obj = {};
  // keys.length > 0;
  keys.map((key) => {
    if (key !== "ID") {
      obj = {
        title: key,
        dataIndex: key,
      };

      if (key === "Наименование компании") {
        const filters = [];
        projects.map((item) => {
          filters.push({
            text: item["Наименование компании"],
            value: item["Наименование компании"],
          });
        });
        obj.filters = filters;
        obj.filterSearch = true;
        obj.onFilter = (value, record) =>
          record["Наименование компании"].startsWith(value);
      }
      if (key === "ИНН") {
        const filters = [];
        projects.map((item) => {
          filters.push({ text: item["ИНН"], value: item["ИНН"] });
        });
        obj.render = (text, record) => (
          <A href={"/catalog/" + record["ИНН"]} text={text} />
        );
        obj.filters = filters;
        obj.filterSearch = true;
        obj.onFilter = (value, record) => record["ИНН"].startsWith(value);
      }
      if (key === "Сфера применения производимой продукции") {
        obj.sorter = (a, b) => a["ИНН"] - b["ИНН"];
      }
      columns.push(obj);
    }
  });
});

export default function Catalog() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  // const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // const getColumns = () => {
  //   const keys = Object.keys(projects[0]);
  //   console.log(keys);
  //   const columns = [];
  //   let obj = {};
  //   // keys.length > 0;
  //   keys.map((key) => {
  //     if (key !== "ID") {
  //       obj = {
  //         title: key,
  //         dataIndex: key,
  //       };
  //       if (key === "ИНН") {
  //         obj.render = (text, record) => (
  //           <A href={"/fasie/" + record["ИНН"]} text={text} />
  //         );
  //       }
  //       if (key === "Выручка, руб (за 2020 г.)") {
  //         obj.sorter = (a, b) => a.age - b.age;
  //       }
  //       columns.push(obj);
  //     }
  //     return columns;
  //   });
  // };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/catalog`)
      .then((response) => {
        setProjects(response.data);
        // const keys = Object.keys(response.data[0]);
        // // console.log(keys);
        // const columns = [];
        // let obj = {};
        // // keys.length > 0;
        // keys.map((key) => {
        //   if (key !== "ID") {
        //     obj = {
        //       title: key,
        //       dataIndex: key,
        //     };
        //     if (key === "ИНН") {
        //       obj.render = (text, record) => (
        //         <A href={"/fasie/" + record["ИНН"]} text={text} />
        //       );
        //     }
        //     if (key === "Выручка, руб (за 2020 г.)") {
        //       obj.sorter = (a, b) => a.age - b.age;
        //     }
        //     columns.push(obj);
        //   }
        //   // console.log(columns);
        //   setColumns(columns);
        setLoading(false);
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
  // console.log(columns);

  return (
    <Layout title="Проекты">
      {/* <div>
        <Space>
          <Button type="primary" onClick={() => setVisible(true)}>
            Добавить проект
          </Button>
        </Space>
      </div>
      <Divider /> */}
      <Table
        rowKey={"ИНН"}
        loading={loading}
        // rowSelection={{ ...rowSelection }}
        columns={columns}
        dataSource={projects}
        scroll={{ x: 700 }}
      />
    </Layout>
  );
}

// Project.auth = true;
