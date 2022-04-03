// import Layout from "../components/admin/layout.admin";
// import { useRouter } from "next/router";
import A from "../components/A";
// import { Tag, Tabs, Table, Tooltip, Button, Radio, Divider, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { Card, Row, Col, Skeleton, Switch } from "antd";
const { Meta } = Card;

const columns = [
  {
    title: "Исполнитель",
    dataIndex: "Исполнитель",
    render: (text, record) => <A href={"/project/"} text={text} />,
  },
];

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/excel/`)
      .then((response) => {
        setRows(response.data);
        console.log("Data", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Switch checked={!loading} onChange={() => setLoading(!loading)} />
        {rows.map((row) => (
          <Col span={8} key={row["Исполнитель"]}>
            <Card
              hoverable
              key={row["Исполнитель"]}
              style={{ width: 150 }}
              cover={
                <img
                  alt="example"
                  src="https://cdn-icons.flaticon.com/png/512/2539/premium/2539875.png?token=exp=1648414991~hmac=16634927614a3af38f188094b42cea94"
                />
              }
            >
              <Skeleton loading={loading} avatar active>
                <Meta
                  title={row["Исполнитель"]}
                  description={row["Название проекта"]}
                />
              </Skeleton>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
  // <Layout title={`Excel`}>
  //   <Table
  //     rowKey={"Исполнитель"}
  //     // rowSelection={{
  //     //   type: selectionType,
  //     //   ...rowSelection,
  //     // }}
  //     columns={columns}
  //     dataSource={rows}
  //   />
  // </Layout>
}
