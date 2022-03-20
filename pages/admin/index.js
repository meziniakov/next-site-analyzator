import A from "../../components/A";
import Layout from "../../components/admin/layout.admin";

export default function Admin() {
  return (
    <Layout title="Главная">
      <A href="/admin/project/add" text="Project" />
    </Layout>
  );
}
