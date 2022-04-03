import Head from "next/head";
import Link from "next/link";
import { Layout, Menu, Breadcrumb, Avatar, Col, Row, Dropdown } from "antd";
import SidebarMenu from "./sidebar.menu";
import A from "../A";
import { UserOutlined } from "@ant-design/icons";
import { signIn, signOut } from "next-auth/react";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

export default function LayoutAdmin({ children, title }) {
  const menu = (
    <Menu>
      <Menu.Item key={"logout"}>
        <a
          onClick={(e) => {
            e.preventDefault;
            signOut();
          }}
        >
          Выйти
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Head>
        <title> {title} | Site Analizator</title>
      </Head>
      <Layout style={{ minHeight: "100vh" }}>
        <SidebarMenu />
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ background: "#fff", padding: 0 }}
          >
            <Row>
              <Col span={22}>
                <Menu theme="white" mode="horizontal">
                  {new Array(2).fill(null).map((_, index) => {
                    const key = index + 1;
                    return <Menu.Item key={key}>{`Страница ${key}`}</Menu.Item>;
                  })}
                </Menu>
              </Col>
              <Col span={2}>
                <Dropdown overlay={menu}>
                  <Avatar icon={<UserOutlined />} />
                </Dropdown>
              </Col>
            </Row>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>
                <A href={"/project"} text={"Проекты"}></A>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </Breadcrumb>
            <main>{children}</main>
          </Content>
          <Footer style={{ textAlign: "center" }}>2022</Footer>
        </Layout>
      </Layout>
    </>
  );
}
