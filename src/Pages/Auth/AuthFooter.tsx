import {Space, Typography} from "antd/es";

// ===========================|| FOOTER - AUTHENTICATION 2 & 3 ||=========================== //
export default function AuthFooter() {
  return (
    <Space className="footer">
      <Typography.Text type="secondary">{`Copyright © ${new Date().getFullYear()}. Schedulify`}</Typography.Text>
    </Space>
  );
}
