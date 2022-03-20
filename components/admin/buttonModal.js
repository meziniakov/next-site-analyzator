import { Modal, Form, Input, InputNumber } from "antd";
const { TextArea } = Input;

export default function CollectionCreateForm({ visible, onCreate, onCancel }) {
  const [form] = Form.useForm();

  return (
    <Modal
      animation={false}
      visible={visible}
      title="Добавить проект"
      okText="Добавить"
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            // console.log("Responce: ", values.keywords.split("\n"));
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          count: 1,
          profitPerVisitor: 0.1,
        }}
      >
        <Form.Item
          name="title"
          label="Тематика сайтов"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите тематику собираемых сайтов!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="keywords"
          label="Ключевые слова"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите ключевые слова!",
            },
          ]}
        >
          <TextArea
            placeholder="Ключевые слова с новой строки"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
        <Form.Item
          name="count"
          label="Страниц выдачи Google"
          className="collection-create-form_last-form-item"
        >
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Form.Item
          name="profitPerVisitor"
          label="Доход на посетителя"
          className="collection-create-form_last-form-item"
        >
          <InputNumber min={0} max={1} step="0.1" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
