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
  const router = useRouter();
  const { inn } = router.query;
  const [data, setData] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDomains(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const getData = useCallback(() => {
    axios
      .get(`http://localhost:3000/api/catalog/${inn}`)
      .then((res) => {
        // console.log(res.data[0]);
        setData(res.data[0]);
      })
      .catch((e) => console.log(e));
  }, [inn]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout title={`Project ${inn}`}>
      <Tabs type="card">
        <TabPane tab="Сбор доменов" key="1">
          <div>
            {}
            <pre>{data["ИНН"]}</pre>
            {/* <Divider /> */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ marginLeft: 8 }}>
                {/* {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""} */}
              </span>
            </div>
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
