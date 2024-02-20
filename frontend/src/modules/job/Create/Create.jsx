import { FileAddOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { Content, Layout, Menu, Sider } from "../../../components";
import { MenuKeyContext } from "../../navbar";
import { BulkUpload } from "./Bulk";
import { SingleUpload } from "./Single";
import "./create.css";

const Create = () => {
  const { uploadMenuKey, setUploadMenuKey } = useContext(MenuKeyContext);

  const sidebarItems = [
    {
      key: "upload-single",
      label: "Post Job",
      icon: <UploadOutlined />,
    },
    {
      key: "upload-bulk",
      label: "Bulk Upload",
      icon: <FileAddOutlined />,
    },
  ];

  const componentMap = {
    "upload-single": <SingleUpload />,
    "upload-bulk": <BulkUpload />,
  };

  const handleMenuKey = (e) => {
    sessionStorage.setItem("uploadMenuKey", e.key);
    setUploadMenuKey(e.key);
  };

  return (
    <Content className="create-container">
      <Layout className="create-inner-layout">
        <Sider className="create-sider" width={220}>
          <Menu
            items={sidebarItems}
            selectedKeys={uploadMenuKey}
            onClick={handleMenuKey}
            className="create-sider-menu"
          />
        </Sider>

        <Content className="create-content">
          {componentMap[uploadMenuKey]}
        </Content>
      </Layout>
    </Content>
  );
};

export default Create;
