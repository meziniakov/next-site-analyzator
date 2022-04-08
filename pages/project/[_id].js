import axios from "axios";
import A from "../../components/A";
import { useRouter } from "next/router";
import Layout from "../../components/admin/layout.admin";
import { useCallback, useEffect, useState } from "react";
import { Tabs, Table, Tooltip, Button, message, Space } from "antd";
import { DeleteOutlined, EditOutlined, MailTwoTone } from "@ant-design/icons";
import Link from "next/link";

const { TabPane } = Tabs;

export default function ProjectId({ props }) {
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
            <Tooltip title={record.emails.join("\n")}>
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
    {
      title: "Действия",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link href={"/"}>
            <a onClick={(e) => handleDelete(e, record._id)}>
              <DeleteOutlined />
            </a>
          </Link>
          <A href={"/project/edit/" + record._id} text={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  const router = useRouter();
  const { _id } = router.query;
  const [domains, setDomains] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [megaindex, setMegaindex] = useState(false);
  const [blackList, setBlackList] = useState(false);
  const [emails, setEmails] = useState(false);

  const getDomains = useCallback(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_SERVER}/api/project/${_id}`)
      .then((res) => {
        setDomains(res.data);
      })
      .catch((e) => console.log(e));
  }, [_id]);

  const handleDelete = async (e, domainId) => {
    e.preventDefault();
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_SERVER}/api/domain/${domainId}`)
      .then((res) => getDomains())
      .catch((e) => console.log(e));
  };

  const handleMegaindex = async (e) => {
    setMegaindex(true);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_SERVER}/api/megaindex/`,
        selectedDomains
      )
      .then((res) => {
        getDomains();
        setMegaindex(false);
      })
      .catch((e) => console.log(e));
  };

  const handleBlackList = async (e) => {
    e.preventDefault();
    setBlackList(true);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_SERVER}/api/domain/blacklist/`,
        selectedDomains
      )
      .then((res) => {
        getDomains();
        setBlackList(false);
      })
      .catch((e) => console.log(e));
  };

  async function handleGetEmails() {
    setEmails(true);
    selectedDomains.forEach(async (el) => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_SERVER}/api/parser/emails`,
          { domain: el.domain }
          // AXIOS_OPTIONS
        )
        .then((res) => {
          res.data.emails.length > 0
            ? message.success(
                `${el.domain}: собрано ${res.data.emails.length} адрес(-ов)`
              )
            : message.error(`${el.domain}: не удалось найти :(`);
          getDomains();
          setEmails(false);
        })
        .catch((e) => message.error("Error"));
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
                  onClick={handleBlackList}
                  disabled={!selectedDomains?.length}
                  loading={blackList}
                >
                  В черный список
                </Button>
                <Button
                  type="primary"
                  onClick={handleGetEmails}
                  disabled={!selectedDomains?.length}
                  loading={emails}
                >
                  Собрать почту
                </Button>
                <Button
                  type="primary"
                  onClick={handleMegaindex}
                  disabled={!selectedDomains?.length}
                  loading={megaindex}
                >
                  Megaindex
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
              // rowSelection={rowSelection}
              rowSelection={{
                ...rowSelection,
              }}
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
// ProjectId.auth = true;
