import React, { useState, useEffect, ReactNode } from "react";
import { Row, Col, Table, Typography, Empty } from "antd";
import styled from "styled-components";
import { ColumnsType } from "antd/lib/table";
import { observer } from "mobx-react";
import { useStores } from "@stores/index";
import { Common } from "@components/Common";

const { Text } = Typography;

const Wrapper = styled("div")`
  padding-right: 12px;
  button {
    margin-top: 3px;
  }
  th,
  td {
    padding: 2px 12px 2px 8px !important;
    font-size: 13px;
  }
  .cost-summary .ant-typography {
    color: darkred;
  }
  .revenue-summary .ant-typography {
    color: darkgreen;
  }
  .ant-table-summary {
    text-align: right;
    .ant-table-cell {
      font-weight: 500;
    }
  }
  .ant-typography {
    font-size: 15px;
  }
  .after-phasing {
    font-size: 13px;
  }
  .normal {
    font-size: 13px;
    font-weight: normal;
  }
  .surplus {
    background: #ebf1de;
  }
  .loss {
    background: #f2dcdb;
  }

  .surplus-extra td .ant-typography {
    color: #008000;
    font-size: 13px !important;
    font-weight: normal !important;
    font-style: italic;
  }

  .loss-extra td .ant-typography {
    color: #963634;
    font-size: 13px !important;
    font-weight: normal !important;
    font-style: italic;
  }
`;

interface DataType {
  key: string;
  title: string;
  value: number;
}

const FinanceSummary = observer((props: { button?: ReactNode; header: string }) => {
  const { uiState, neighbourhoodStore } = useStores();
  const { surplusLoss, setSurplusLoss, summaryExtra, currentStep, dashboardProcessing, setDashboardProcessing } = uiState;
  const { CostsDashboard, RevenuesDashboard, NeighbourhoodUpdated, LSCreated } = neighbourhoodStore;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const costColumns: ColumnsType<DataType> = [
    {
      title: "Item",
      dataIndex: "title",
      align: "right",
      width: 270,
    },
    {
      title: "Cost",
      dataIndex: "value",
      align: "right",
      render: (text, record) => currency.format(record.value),
    },
  ];
  const costDataModel: DataType[] = [
    { key: "off_site", title: "Off-site costs", value: 0 },
    {
      key: "land",
      title: "Land acquisition",
      value: 0,
    },
    {
      key: "site",
      title: "Site preparation",
      value: 0,
    },
    {
      key: "arteries",
      title: "Arteries (main roads)",
      value: 0,
    },
    {
      key: "secondaries",
      title: "Secondaries (distributor roads)",
      value: 0,
    },
    {
      key: "tertiaries",
      title: "Tertiaries (access and local roads)",
      value: 0,
    },
    {
      key: "on_site",
      title: "On-site amenities",
      value: 0,
    },
    {
      key: "open_spaces",
      title: "Public spaces",
      value: 0,
    },
    {
      key: "other",
      title: "Other (if any)",
      value: 0,
    },
  ];

  const revenueColumns: ColumnsType<DataType> = [
    {
      title: "Item",
      dataIndex: "title",
      align: "right",
      width: 270,
    },
    {
      title: "Revenue",
      dataIndex: "value",
      align: "right",
      render: (text, record) => currency.format(record.value),
    },
  ];
  const revenueDataModel: DataType[] = [
    {
      key: "arteries",
      title: "Land on arteries",
      value: 0,
    },
    {
      key: "secondaries",
      title: "Land on secondaries",
      value: 0,
    },
    {
      key: "local_roads",
      title: "Land on local roads",
      value: 0,
    },
    {
      key: "off_grid",
      title: "Land on affordable off-grid clusters",
      value: 0,
    },
    {
      key: "public_lands",
      title: "Public lands",
      value: 0,
    },
  ];

  const [costData, setCostData] = useState<DataType[]>([]);
  const [revenueData, setRevenueData] = useState<DataType[]>([]);

  useEffect(() => {
    let total = 0;
    costDataModel.forEach((data) => {
      data.value = CostsDashboard[data.key];
      total -= CostsDashboard[data.key];
      // data.value = costSubtotals[data.key];
      // total -= costSubtotals[data.key];
    });

    if (currentStep.mainStep === 0) {
      setCostData(costDataModel.slice(0, 3));
    } else if (currentStep.mainStep === 1) {
      setCostData(costDataModel);
    }

    revenueDataModel.forEach((data) => {
      data.value = RevenuesDashboard[data.key];
      total += RevenuesDashboard[data.key];
    });

    setRevenueData(revenueDataModel);

    setSurplusLoss(total);
    // setMobiusUpdated(false);
  }, [NeighbourhoodUpdated]);

  return (
    <Wrapper>
      <Row>
        {props.button}
        <Col span={12}>
          <h2>{props.header}</h2>
        </Col>
        <Col span={24}>
          <div style={{ height: "245px", position: "relative" }}>
            {LSCreated ? (
              dashboardProcessing ? (
                <Common.Calculating />
              ) : (
                <Table
                  showHeader={false}
                  columns={costColumns}
                  dataSource={costData}
                  size="small"
                  pagination={false}
                  summary={(pageData) => {
                    let subtotal = 0;

                    pageData.forEach(({ value }) => {
                      subtotal += value;
                    });

                    // setfsTCost(subtotal);
                    return (
                      <Table.Summary.Row className="cost-summary">
                        <Table.Summary.Cell index={0}>
                          <Text>Project expenditures</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text>{currency.format(subtotal)}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              )
            ) : (
              <Empty />
            )}
          </div>
        </Col>
        {currentStep.mainStep === 1 && (
          <Col span={24}>
            <div style={{ height: "360px", position: "relative" }}>
              {dashboardProcessing ? (
                <Common.Calculating />
              ) : (
                <Table
                  showHeader={false}
                  columns={revenueColumns}
                  dataSource={revenueData}
                  size="small"
                  pagination={false}
                  summary={(pageData) => {
                    let subtotal = 0;

                    pageData.forEach(({ value }) => {
                      subtotal += value;
                    });
                    // setfsTRevenue(subtotal);
                    return (
                      <>
                        <Table.Summary.Row className="revenue-summary">
                          <Table.Summary.Cell index={0}>
                            <Text>Project revenues</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text>{currency.format(subtotal)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row className={surplusLoss >= 0 ? "surplus" : "loss"}>
                          <Table.Summary.Cell index={0}>
                            <Text>Project surplus (loss)</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text>{currency.format(surplusLoss)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            <Text className="after-phasing">after phasing…</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text className="after-phasing">
                              NPV@ {Number(summaryExtra.after).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 1 })}
                            </Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            <Text className="normal">Cost of finance, NPV</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text className="normal">{currency.format(summaryExtra.cost)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            <Text className="normal">Price contingency (inflation), NPV</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text className="normal">{currency.format(summaryExtra.price)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row className={summaryExtra.subsidy >= 0 ? "surplus" : "loss"}>
                          <Table.Summary.Cell index={0}>
                            <Text>Project surplus, NPV</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text>{currency.format(summaryExtra.surplus)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row className={summaryExtra.subsidy >= 0 ? "surplus-extra" : "loss-extra"}>
                          <Table.Summary.Cell index={0}>
                            <Text>Public income (subsidy), NPV</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text>{currency.format(summaryExtra.subsidy)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row className={summaryExtra.loss >= 0 ? "surplus-extra" : "loss-extra"}>
                          <Table.Summary.Cell index={0}>
                            <Text>Private developer profit (loss), NPV</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text>{currency.format(summaryExtra.loss)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row className={summaryExtra.developer >= 0 ? "surplus-extra" : "loss-extra"}>
                          <Table.Summary.Cell index={0}>
                            <Text>Private developer, IRR</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text>{Number(summaryExtra.developer).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 1 })}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
                />
              )}
            </div>
          </Col>
        )}
      </Row>
    </Wrapper>
  );
});
export default FinanceSummary;
