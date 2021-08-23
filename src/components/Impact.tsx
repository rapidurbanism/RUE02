import React from "react";
import { Row, Col } from "antd";
import { Radar } from "@ant-design/charts";

const data = [
  { item: "Financial\ninclusion", scenario1: 40 },
  { item: "Affordability", scenario1: 70 },
  { item: "Jobs", scenario1: 55 },
  { item: "Profitability", scenario1: 60 },
  { item: "Adaptation", scenario1: 35 },
  { item: "Mitigation", scenario1: 50 },
  { item: "Fiscal\nscalability", scenario1: 65 },
  { item: "Resource\nmobilization", scenario1: 75 },
];

const Impact = () => {
  const config = {
    height: 250,
    data,
    angleField: "item",
    radiusField: "scenario1",
    angleAxis: {
      label: { style: { fontSize: 14, fill: "darkgreen" } },
    },
    line: { visible: true },
    point: {
      visible: true,
      shape: "circle",
    },
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Row justify="center">
        <Col>
          <h2>Impact</h2>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Radar {...config} />
        </Col>
      </Row>
    </div>
  );
};

export default Impact;
