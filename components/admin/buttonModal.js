import { Modal, Form, Input, InputNumber } from "antd";

export default function buttonModal({
  visible,
  title,
  okText,
  cancelText,
  onCreate,
  onCancel,
  children,
  form,
}) {
  return (
    <Modal
      animation={false}
      visible={visible}
      title={title}
      okText={okText}
      cancelText={cancelText}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      {children}
    </Modal>
  );
}
