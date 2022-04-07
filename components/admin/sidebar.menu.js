import { Layout, Menu } from "antd";
import { useState } from "react";
import { DesktopOutlined, GlobalOutlined } from "@ant-design/icons";
const { Sider } = Layout;

export default function SidebarMenu() {
  const [collapsed, setCollapsed] = useState(true);

  function onCollapse() {
    setCollapsed(!collapsed);
  }

  return (
    <Sider
      breakpoint="xl"
      collapsedWidth="0"
      collapsible
      collapsed={!collapsed}
      onCollapse={onCollapse}
    >
      <div
        className="logo"
        style={{
          height: "32px",
          margin: "16px",
          background: "rgba(255, 255, 255, 0.3",
        }}
      >
        <GlobalOutlined style={{ height: "5em", color: "white" }} />
      </div>
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" icon={<DesktopOutlined />}>
          Проекты
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
