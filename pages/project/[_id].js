import axios from "axios";
import A from "../../components/A";
import { useRouter } from "next/router";
import Layout from "../../components/admin/layout.admin";
import { useCallback, useEffect, useState } from "react";
import { Tabs, Table, Tooltip, Button, message, Space } from "antd";
import { MailTwoTone } from "@ant-design/icons";

const { TabPane } = Tabs;

const columns = [
  {
    title: "Домен",
    dataIndex: "domain",
    width: 300,
    fixed: "left",
    ellipsis: {
      showTitle: false,
    },
    render: (text, record) => (
      <Tooltip placement="topLeft" title={record.title}>
        <A href={record._id} text={text} />
        <br />
        <span>{record.title}</span>
      </Tooltip>
    ),
  },
  {
    title: "Email",
    dataIndex: "emails",
    width: 80,
    render: (text, record) => (
      <>
        {text && record.emails?.length !== 0 ? (
          <Tooltip title={text}>
            <MailTwoTone twoToneColor="#1890ff" />
          </Tooltip>
        ) : (
          ""
        )}
      </>
    ),
  },
  {
    title: `TR`,
    dataIndex: "traffic",
  },
  {
    title: `TS`,
    dataIndex: "traffic_season",
  },
  {
    title: `PS`,
    dataIndex: "project_stage",
  },
  {
    title: `Profit`,
    dataIndex: "profit_await",
  },
  {
    title: `Max цена`,
    dataIndex: "evaluate_max",
  },
  {
    title: `Ср. цена`,
    dataIndex: "evaluate_middle",
  },
  {
    title: `Min цена`,
    dataIndex: "evaluate_min",
  },
];

export default function ProjectId({ props }) {
  const router = useRouter();
  const { _id } = router.query;
  const [domains, setDomains] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);

  const getDomains = useCallback(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_SERVER}/api/project/${_id}`)
      .then((res) => {
        setDomains(res.data);
      })
      .catch((e) => console.log(e));
  }, [_id]);

  async function onGetEmails(req, res) {
    selectedDomains.forEach(async (el) => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_SERVER}/api/parser/emails`,
          { domain: el.domain }
          // {
          //   headers: {
          //     "Access-Control-Allow-Origin": "*",
          //     "Access-Control-Allow-Credentials": "true",
          //     "Access-Control-Max-Age": "1800",
          //     "Access-Control-Allow-Headers": "content-type",
          //     "Access-Control-Allow-Methods":
          //       "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          //   },
          // }
          // AXIOS_OPTIONS
        )
        .then((res) => {
          console.log(res.data.emails);
          res.status === "200"
            ? message.error("Ошибка")
            : message.success("Успешно");
          getDomains();
        })
        .catch((e) => alert(e.message, "error"));
    });
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDomains(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  useEffect(() => {
    getDomains();
  }, [getDomains, _id]);

  return (
    <Layout title={`Project ${_id}`}>
      <Tabs type="card">
        <TabPane tab="Сбор доменов" key="1">
          <div>
            {/* <Divider /> */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  Добавить домен
                </Button>
                <Button
                  type="primary"
                  onClick={onGetEmails}
                  disabled={!selectedDomains?.length}
                  // loading={loading}
                >
                  Собрать почту
                </Button>
              </Space>
              <span style={{ marginLeft: 8 }}>
                {/* {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""} */}
              </span>
            </div>
            <Table
              pagination={false}
              rowKey={"_id"}
              scroll={{ y: "70vh", x: 1500 }}
              rowSelection={rowSelection}
              // rowSelection={{
              //   type: selectionType,
              //   ...rowSelection,
              // }}
              columns={columns}
              dataSource={domains}
            />
          </div>
        </TabPane>
        <TabPane tab="Отбор лучших" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Рассылка" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </Layout>
  );
}
ProjectId.auth = true;
