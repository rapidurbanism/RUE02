import React from "react";
import IframeComm from "@utils/IframeComm.js";
import { useStores } from "@stores/index";
import { toJS } from "mobx";
import { observer } from "mobx-react";

const Mobius = observer((props: { hidden?: boolean }) => {
  const { hidden } = props;
  const { uiState, mobiusStore } = useStores();
  const { setMobiusUpdated } = uiState;
  const { postMessageData, initialModel, setMobiusResult, setGeoJSON } = mobiusStore;

  const h = window.innerHeight - 7;
  const attr = {
    src: `https://design-automation.github.io/mobius-parametric-modeller-0-5-77/minimal?file=${initialModel}&showViewer=[1,2]`,
    // src: `https://design-automation.github.io/mobius-parametric-modeller-dev-0-6/minimal?file=${initialModel}&showViewer=[1,2]`,
    width: "100%",
    height: hidden ? "0" : h,
  };

  const onReceiveMessage = (msg: any) => {
    console.log(msg)
    if (msg.data.messageType === "get_file") {
      setGeoJSON(msg.data.file_data as string);
    } else if (msg.data.messageType === "send_data") {
      console.log("MOBIUS: setMobiusResult", msg.data.data);
      setMobiusResult(msg.data.data as any);
      setMobiusUpdated(true);
    }

    //if (msg.data.messageType === "send_data") {

    if (msg.data.model === "neighbourhood") {
    }
  };

  const onReady = () => {
    // console.log("1. MOBIUS READY");
  };

  return <IframeComm attributes={attr} postMessageData={toJS(postMessageData)} handleReceiveMessage={onReceiveMessage} handleReady={onReady} />;
});
export default Mobius;
