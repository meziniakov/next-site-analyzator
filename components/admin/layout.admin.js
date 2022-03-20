import Head from "next/head";
import { Layout, Link, Menu, Breadcrumb } from "antd";
import SidebarMenu from "./sidebar.menu";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

export default function LayoutAdmin({ children, title }) {
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
            <Menu theme="white" mode="horizontal">
              {new Array(5).fill(null).map((_, index) => {
                const key = index + 1;
                return <Menu.Item key={key}>{`Страница ${key}`}</Menu.Item>;
              })}
            </Menu>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>
                {/* <Link href="/project">Project</Link> */}
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a>Bill</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Bill a cat</Breadcrumb.Item>
            </Breadcrumb>
            <main>{children}</main>
          </Content>
          <Footer style={{ textAlign: "center" }}>2022</Footer>
        </Layout>
      </Layout>
    </>
  );
}
