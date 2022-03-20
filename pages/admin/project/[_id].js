import A from "../../../components/A";
import Layout from "../../../components/admin/layout.admin";
import { useRouter } from "next/router";
import { Tag, Tabs, Table, Tooltip, Button, Radio, Divider } from "antd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
const { TabPane } = Tabs;

const columns = [
  {
    title: "Домен",
    dataIndex: "domain",
    render: (text, record) => (
      <>
        <A href={record._id} text={text} />
        <br />
        <span>{record.title}</span>
      </>
    ),
  },
  // {
  //   title: "Title",
  //   dataIndex: "title",
  //   render: (keywords) => (
  //     <>
  //       {keywords.map((keyword) => (
  //         <Tag color="blue" key={keyword}>
  //           {keyword}
  //           <br />
  //         </Tag>
  //       ))}
  //     </>
  //   ),
  // },
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

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

export default function ProjectId({ props }) {
  const router = useRouter();
  const { _id } = router.query;
  const [domains, setDomains] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");

  const getDomains = useCallback(() => {
    axios
      .get("http://localhost:5000/api/project/" + _id)
      .then((res) => {
        console.log("Res", res);
        // alert
        //   ? alert(res.data, 'error')
        //   : alert(res.data.countUpdate, 'success');
        setDomains(res.data);
      })
      .catch((e) => console.log(e));
  }, [_id]);

  useEffect(() => {
    getDomains();
  }, [getDomains, _id]);

  function callback(key) {
    console.log(key);
  }

  return (
    <Layout title={`Project ${router.query._id}`}>
      <Tabs onChange={callback} type="card">
        <TabPane tab="Сбор доменов" key="1">
          <div>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              Добавить домен
            </Button>
            <Divider />
            <Table
              pagination={false}
              rowKey={"_id"}
              rowSelection={{
                type: selectionType,
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
