import Layout from "../../components/admin/layout.admin";
// import { useRouter } from "next/router";
import A from "../../components/A";
// import { Tag, Tabs, Table, Tooltip, Button, Radio, Divider, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Skeleton, Switch, List, Select } from "antd";
import Image from "next/image";
import Link from "next/link";
// const { Header, Footer, Sider, Content } = Layout;
const { Meta } = Card;
const { Option } = Select;

export default function Excel({ data }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // console.log(data);
    if (data.length > 0) {
      setLoading(!loading);
    }
    setLoading(!loading);
  }, []);

  const handleChange = (e) => {
    console.log(e);
  };

  return (
    <Layout>
      <div className="site-card-wrapper">
        <Select
          // defaultValue="?sfera=Прочая деятельность"
          style={{ width: 120 }}
          // onChange={handleChange}
          // onSelect={(e) => {
          //   // console.log(e);
          //   <Link href="/s" />;
          // }}
        >
          <Option value="?sfera=Промышленность">
            <Link href={"?sfera=Промышленность"}>Промышленность</Link>
          </Option>
          <Option value="?sfera=Прочая деятельность">
            <Link href={"?sfera=Прочая деятельность"}>Прочая деятельность</Link>
          </Option>
        </Select>
        {/* <Switch checked={!loading} onChange={() => setLoading(!loading)} /> */}
        <Row gutter={[16, 16]}>
          {data.map((row) => (
            <Col className="gutter-row" span={8} key={row["ИНН"]}>
              <Card
                hoverable
                key={row["ИНН"]}
                // style={{ width: 150 }}
                cover={
                  <Image
                    src={
                      "https://cdn-icons-png.flaticon.com/512/2845/2845818.png"
                    }
                    width={100}
                    height={100}
                    alt={row["ИНН"]}
                  />
                }
              >
                <Skeleton loading={loading} active>
                  <Meta
                    title={row["ИНН"]}
                    description={row["Наименование компании"]}
                  />
                  {row["Сфера применения производимой продукции"]}
                </Skeleton>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
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

export async function getServerSideProps(ctx) {
  // export async function getStaticProps(ctx) {
  console.log(ctx);
  const { sfera } = ctx.query;
  let res;
  if (sfera) {
    res = await fetch(`http://localhost:3000/api/anketa?sfera=${sfera}`);
  } else {
    res = await fetch(`http://localhost:3000/api/anketa`);
  }
  const data = await res.json();
  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: { data },
  };
}
