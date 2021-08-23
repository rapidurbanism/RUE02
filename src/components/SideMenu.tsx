import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Drawer, Menu, Upload, Tag, message } from "antd";
import { observer } from "mobx-react";
import { useStores } from "@stores/index";
import Logo from "../assets/logo.jpg";
import styled from "styled-components";
import ProjectNameModal from "./ProjectNameModel";
import { StepParams } from "../stores/types";
import compareVersions from "compare-versions";

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 10px 0;
    text-align: center;
  }
  img {
    width: 150px;
  }
  .title {
    font-size: 18px;
    padding: 7px;
    font-weight: 500;
  }
  .ant-menu {
    margin-top: 20px;
  }
  .ant-menu-vertical .ant-menu-item {
    font-size: 16px;
    padding: 0 30px;

    &:last-child {
      position: fixed;
      bottom: 10px;
      width: 256px;
    }

    .ant-upload {
      font-size: 16px;
      width: 100%;
      line-height: 40px;
      display: block;
    }
  }

  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    color: white;
    background-color: #346582;
    .ant-upload {
      color: white;
    }
  }
`;

const FileSaver = require("file-saver");

const latest_version = "0.3.0";

const SideMenu = observer((props: any) => {
  const { openProject } = props;
  const { uiState, mobiusStore } = useStores();
  const { sideMenuVisible, setSideMenuVisible, currentStep, stepParams, projectTitle, setProjectTitle } = uiState;
  const { host, setpostMessageData, getGeoJSON, CurrentGeoJSON, setCurrentGeoJSON } = mobiusStore;

  const [modalVisible, setModalVisible] = useState(false);

  const onCreate = (values: any) => {
    const data = {
      title: projectTitle,
      stepParams: stepParams,
      currentStep: currentStep,
      mobius: host,
      geojson: JSON.parse(getGeoJSON),
      version: latest_version,
    };
    const blob = new Blob([JSON.stringify(data)], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, `${values["filename"]}.rue`);

    setModalVisible(false);
    setSideMenuVisible(false);
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
    setSideMenuVisible(false);
  };
  const onDrawerClose = () => {
    setSideMenuVisible(false);
  };

  const openPlan = {
    beforeUpload: (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const result = JSON.parse(reader.result as string) as StepParams;
          setProjectTitle(result.title);
          if (compareVersions(latest_version, result.version) === 1) {
            message.info("The file you are importing is from a previous version of RUE.");
          }
          setTimeout(() => {
            openProject(result.stepParams, result.currentStep);
          }, 500);
        }
      };
      reader.readAsText(file);
      setSideMenuVisible(false);
      return false;
    },
    showUploadList: false,
    accept:".rue"
  };

  const setSite = {
    beforeUpload: (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const result = reader.result;
          setTimeout(() => {
            setpostMessageData({
              messageType: "save_file",
              file_data: result,
              file_name: file.name,
            });
            setCurrentGeoJSON(file.name);
          }, 500);
        }
      };
      reader.readAsText(file);
      setSideMenuVisible(false);
      return false;
    },
    showUploadList: false,
    accept:".geojson"
  };

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "save_plan":
        setModalVisible(true);
        setpostMessageData({
          messageType: "get_file",
          file_name: CurrentGeoJSON,
        });
        break;
      case "open_plan":
        //
        break;
      case "sign_out":
        signOut();
        break;
      default:
        break;
    }
  };
  return (
    <StyledDrawer placement="left" closable={false} onClose={onDrawerClose} visible={sideMenuVisible}>
      <img src={Logo} alt="IAUAI" />
      <div className="title">Rapid Urbanism Explorer</div>
      <Tag color="#144465">v{latest_version}</Tag>
      <Menu onClick={handleMenuClick} selectable={false}>
        <Menu.Item key="save_plan">Save Plan</Menu.Item>
        <Menu.Item key="open_plan">
          <Upload {...openPlan}>Open Plan</Upload>
        </Menu.Item>
        <Menu.Item key="set_site">
          <Upload {...setSite}>Set Site</Upload>
        </Menu.Item>
        <Menu.Item key="sign_out">Sign Out</Menu.Item>
      </Menu>
      <ProjectNameModal
        visible={modalVisible}
        onCreate={onCreate}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </StyledDrawer>
  );
});

export default SideMenu;
