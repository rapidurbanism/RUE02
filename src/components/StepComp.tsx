import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Steps, Form, Slider, Button, Row, Col, InputNumber } from "antd";
import styled from "styled-components";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { useStores } from "@stores/index";
import { Common } from "@components/Common";
import { StepParams } from "../stores/types";
import { formatNumber } from "@utils/index";

const Wrapper = styled("div")`
  padding: 0px 10px 20px 20px;
  .ant-input-number {
    width: 55px;
    margin-left: 10px;
    margin-bottom: 2px;
    .ant-input-number-handler-wrap {
      width: 15px;
      .ant-input-number-handler-up-inner,
      .ant-input-number-handler-down-inner {
        right: 1px;
      }
    }
    .ant-input-number-input {
      height: 26px;
      padding: 0 5px;
    }
  }
  .ant-steps-vertical {
    .ant-steps-item-icon {
      margin-right: 5px;
    }
    .ant-steps-item-title {
      font-size: 18px;
    }
    .ant-steps-item-content {
      /* min-height: 55px; */
    }
  }

  .substep {
    padding-top: 20px;
    .ant-steps-item-title {
      font-size: 14px;
      margin-left: 20px;
    }
    .ant-steps-item-content {
      min-height: 40px;
      margin-left: -17px;
      float: left;
      width: calc(100% - 15px);
    }
    .ant-steps-item-tail {
      padding: 27px 0 4px !important;
    }

    .ant-steps-item-description {
      padding-left: 10px;
    }

    .ant-form-item {
      margin-bottom: unset;
    }
    .ant-steps-item {
      cursor: pointer;
    }

    .ant-steps-item-wait .ant-steps-item-icon {
      background-color: #fff;
      border-color: rgba(0, 0, 0, 0.25) !important;

      .ant-steps-icon {
        color: rgba(0, 0, 0, 0.25) !important;
      }
    }

    .ant-steps-small .ant-steps-item-icon {
      background-color: #fff;
      border-color: rgba(0, 0, 0, 0.25);
    }
  }
`;

// const CityArea = styled("div")`
//   div {
//     float: left;
//     &.value {
//       width: 60px;
//       padding: 0 5px;
//       text-align: right;
//     }
//   }
// `;

const { Step } = Steps;

const StepComp = observer(
  forwardRef((props, ref) => {
    const { uiState, mobiusStore } = useStores();
    const {
      step,
      setStep,
      stepInitialValue,
      currentStep,
      setMobiusUpdated,
      setFinanceShouldUpdate,
      toggleFinanceView,
      setDashboardProcessing,
      setStepParams,
    } = uiState;
    const { setpostMessageData, model, setModel, host } = mobiusStore;

    const [mainStep, setMainStep] = useState(0);

    const [form] = Form.useForm();

    const initFormData = toJS(stepInitialValue);

    useImperativeHandle(ref, () => ({
      updateParams: (params: StepParams, step: { mainStep: number; subStep: number }) => {
        if (step !== undefined) {
          switchStep(step.mainStep, step.subStep);
        }
        onClickApply(params);
        setStepParams(params);
      },
    }));

    const onClickApply = (formData: object) => {
      if (toJS(currentStep).mainStep === 1) {
        setMobiusUpdated(true);
        setFinanceShouldUpdate(true);
        toggleFinanceView("update");
      }
      setDashboardProcessing(true);

      setpostMessageData({
        messageType: "update",
        params: formData,
        keepSettings: true,
      });
    };
    const onFinish = () => {
      // const values = await form.validateFields();
      onClickApply(initFormData);
    };

    // click on main step, Mobius will render with new model
    const onChangeStep = (model: string, formData: object, step: number) => {

      setpostMessageData({
        messageType: "update",
        url: model,
        params: formData,
        keepSettings: true,
      });

      setFinanceShouldUpdate(true);
      toggleFinanceView("update");
    };

    const range = (min: number, max: number) => {
      return { min: min, max: max, tooltipVisible: false };
    };

    const onChangeMain = (current: number) => {
      if (current !== 0) {
        setStep(current, step.get(current));
      }
      setMainStep(current);
      setDashboardProcessing(true);

      let _model = model;
      switch (current) {
        case 0:
          _model = host + "city.mob";
          onChangeStep(_model, initFormData, current);
          setModel(_model);
          break;
        case 1:
          _model = host + "neighbourhood.mob";
          onChangeStep(_model, initFormData, current);
          setModel(_model);
          break;
        case 2:
          _model = host + "tissue.mob";
          onChangeStep(_model, initFormData, current);
          setModel(_model);
          break;
        // case 3:
        //   _model = host + "building.mob";
        //   onChangeStep(_model, formData);
        //   setModel(_model);
        //   break;
        default:
          break;
      }
    };

    const onChangeSub = (current: number) => {
      // console.log("changing subStep", "main=>", mainStep, "sub=>", current);
      setStep(mainStep, current);
    };

    const [switching, setSwitching] = useState(false);

    const switchStep = (main: number, sub: number) => {
      setSwitching(true);
      setMainStep(main);
      setStep(main, sub);
      setSwitching(false);
    };

    useEffect(() => {
      // onChangeStep(model, formData);
    }, []);

    // const [cityArea, setCityArea] = useState<{
    //   site_front_dim: number | string | undefined;
    //   site_back_dim: number | string | undefined;
    //   site_back_shift: number | string | undefined;
    //   site_sides_dim: number | string | undefined;
    // }>({
    //   site_front_dim: 400,
    //   site_back_dim: 400,
    //   site_back_shift: 0,
    //   site_sides_dim: 400,
    // });

    const formFieldChange = (field: string, value: number | string | undefined) => {
      stepInitialValue[field] = value;
      // console.log(formData[field]);
    };

    const siteArea = () => {
      return (
        Math.round(((stepInitialValue["site_front_dim"] + stepInitialValue["site_back_dim"]) / 2) * stepInitialValue["site_sides_dim"] * 0.01) / 100
      );
    };

    const round2 = (num: number) => {
      return Math.round(num * 100) / 100;
    };

    interface FormData {
      [key: string]: any;
    }

    const renderFormItem = (key: string, label: string, range: object, unit?: string) => {
      const prop = {
        onChange(value: number | string | undefined) {
          formFieldChange(key, value);
        },
        value: initFormData[key],
        ...range,
      };

      return (
        <Form.Item name={key} label={label}>
          <Row align="bottom">
            <Col span={14}>
              <Slider {...prop} />
            </Col>
            <Col span={6}>
              <InputNumber {...prop} formatter={(value) => `${value}`} />
            </Col>
            <Col span={4}>
              {unit !== undefined ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: unit,
                  }}
                ></div>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Form.Item>
      );
    };

    return (
      <Wrapper>
        {/* <Button onClick={() => switchStep(2, 1)}>Switch</Button> */}
        {!switching ? (
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Steps direction="vertical" current={mainStep} onChange={onChangeMain}>
              {/* =============================================================================== */}

              <Step
                title="City"
                description={
                  mainStep === 0 && (
                    <Steps direction="vertical" current={step.get(0)} onChange={onChangeSub} className="substep" size="small">
                      <Step
                        title="Site Location"
                        description={
                          step.get(0) === 0 && (
                            <>
                              {renderFormItem("latitude", "Latitude", range(-180, 180), "deg")}
                              {renderFormItem("longitude", "Longitude", range(-90, 90), "deg")}
                              {renderFormItem("rotation", "Rotation", range(-180, 180), "deg")}
                            </>
                          )
                        }
                      />

                      <Step
                        title="Site Dimensions"
                        description={
                          step.get(0) === 1 && (
                            <>
                              {renderFormItem("site_front_dim", "Front", range(300, 1000), "m")}
                              {renderFormItem("site_back_dim", "Rear", range(300, 1000), "m")}
                              {renderFormItem("site_back_shift", "Rear shift", range(-500, 500), "m")}
                              {renderFormItem("site_sides_dim", "Depth", range(300, 1000), "m")}
                              <div>Site area = {siteArea()} Ha</div>
                            </>
                          )
                        }
                      />

                      {/* <Step
                      title="Density"
                      description={
                        step.get(0) === 2 && (
                          <>
                            {renderFormItem(formData, "pop_density", "Population density", range(0, 1000), "pp/ha")}
                            <div>Population = {formatNumber(siteArea() * stepInitialValue["pop_density"])}</div>
                          </>
                        )
                      }
                    /> */}
                      {/* 
                    <Step
                      title="Programme"
                      description={
                        step.get(0) === 2 && (
                          <>
                            {renderFormItem(
                              formData,
                              "open_space_ratio",
                              "Open space",
                              range(0, 10),
                              "%"
                            )}
                            <div>
                              Open space area ={" "}
                              {formatNumber(
                                ((stepInitialValue["site_front_dim"] +
                                  stepInitialValue["site_back_dim"]) /
                                  2) *
                                  stepInitialValue["site_sides_dim"] *
                                  0.01 *
                                  stepInitialValue["open_space_ratio"]
                              )}{" "}
                              m<sup>2</sup>
                              <p></p>
                            </div>
                            {renderFormItem(
                              formData,
                              "commercial_ratio",
                              "Commercial",
                              range(0, 30),
                              "%"
                            )}
                            <div>
                              Commercial area ={" "}
                              {formatNumber(
                                ((stepInitialValue["site_front_dim"] +
                                  stepInitialValue["site_back_dim"]) /
                                  2) *
                                  stepInitialValue["site_sides_dim"] *
                                  0.01 *
                                  stepInitialValue["commercial_ratio"]
                              )}{" "}
                              m<sup>2</sup>
                              <p></p>
                            </div>
                            {renderFormItem(
                              formData,
                              "manufacturing_ratio",
                              "Manufacturing",
                              range(0, 30),
                              "%"
                            )}
                            <div>
                              Manufacturing area ={" "}
                              {formatNumber(
                                ((stepInitialValue["site_front_dim"] +
                                  stepInitialValue["site_back_dim"]) /
                                  2) *
                                  stepInitialValue["site_sides_dim"] *
                                  0.01 *
                                  stepInitialValue["manufacturing_ratio"]
                              )}{" "}
                              m<sup>2</sup>
                            </div>
                          </>
                        )
                      }
                    />

                    <Step
                      title="Kindergartens"
                      description={
                        step.get(0) === 3 && (
                          <>
                            {renderFormItem(
                              formData,
                              "kin_area_pp",
                              "Area per person",
                              range(0, 20),
                              "m<sup>2</sup>"
                            )}
                            {renderFormItem(
                              formData,
                              "kin_min_p",
                              "Minimum number of students",
                              range(0, 500)
                            )}
                            {renderFormItem(
                              formData,
                              "kin_pop_ratio",
                              "Population",
                              range(0, 50),
                              "%"
                            )}
                          </>
                        )
                      }
                    />

                    <Step
                      title="Primary School"
                      description={
                        step.get(0) === 4 && (
                          <>
                            {renderFormItem(
                              formData,
                              "prim_area_pp",
                              "Area per person",
                              range(0, 20),
                              "m<sup>2</sup>"
                            )}
                            {renderFormItem(
                              formData,
                              "prim_min_p",
                              "Minimum number of students",
                              range(0, 500)
                            )}
                            {renderFormItem(
                              formData,
                              "prim_pop_ratio",
                              "Population",
                              range(0, 50),
                              "%"
                            )}
                          </>
                        )
                      }
                    />

                    <Step
                      title="Secondary School"
                      description={
                        step.get(0) === 5 && (
                          <>
                            {renderFormItem(
                              formData,
                              "sec_area_pp",
                              "Area per person",
                              range(0, 20),
                              "m<sup>2</sup>"
                            )}
                            {renderFormItem(
                              formData,
                              "sec_min_p",
                              "Minimum number of students",
                              range(0, 500)
                            )}
                            {renderFormItem(
                              formData,
                              "sec_pop_ratio",
                              "Population",
                              range(0, 50),
                              "%"
                            )}
                          </>
                        )
                      }
                    />

                    <Step
                      title="Adult Training"
                      description={
                        step.get(0) === 6 && (
                          <>
                            {renderFormItem(
                              formData,
                              "adu_area_pp",
                              "Area per person",
                              range(0, 20),
                              "m<sup>2</sup>"
                            )}
                            {renderFormItem(
                              formData,
                              "adu_min_p",
                              "Minimum number of students",
                              range(0, 500)
                            )}
                            {renderFormItem(
                              formData,
                              "adu_pop_ratio",
                              "Population",
                              range(0, 50),
                              "%"
                            )}
                          </>
                        )
                      }
                    /> */}
                    </Steps>
                  )
                }
              />

              {/* =============================================================================== */}

              <Step
                title="Neighbourhood"
                description={
                  mainStep === 1 && (
                    <Steps direction="vertical" current={step.get(1)} onChange={onChangeSub} className="substep" size="small">
                      <Step
                        title="Road Spacing"
                        description={
                          step.get(1) === 0 && (
                            <>
                              {renderFormItem("local_along_art", "Spacing of local roads along arteries", range(30, 300), "m")}
                              {renderFormItem("local_along_sec", "Spacing of local roads along secondaries", range(30, 300), "m")}
                              {renderFormItem("local_along_local", "Spacing of local roads along local roads", range(30, 300), "m")}
                            </>
                          )
                        }
                      />

                      <Step
                        title="Road Widths"
                        description={
                          step.get(1) === 1 && (
                            <>
                              {renderFormItem("road_art_w", "Arterial roads width", range(10, 50), "m")}
                              {renderFormItem("road_sec_w", "Secondary roads width", range(10, 50), "m")}
                              {renderFormItem("road_ter_w", "Local roads width", range(10, 50), "m")}
                            </>
                          )
                        }
                      />

                      <Step
                        title="Partition Depths"
                        description={
                          step.get(1) === 2 && (
                            <>
                              {renderFormItem("art_part_d", "Partitions facing arterial roads", range(10, 50), "m")}
                              {renderFormItem("sec_part_d", "Partitions facing secondary roads", range(10, 50), "m")}
                              {renderFormItem("ter_part_d", "Partitions facing local roads", range(10, 50), "m")}
                            </>
                          )
                        }
                      />

                      <Step
                        title="Off Grid Partitions"
                        description={
                          step.get(1) === 3 && (
                            <>
                              {renderFormItem("og_part_w", "Partition width", range(10, 100), "m")}
                              {renderFormItem("og_part_d", "Partition depth", range(10, 100), "m")}
                              <div>
                                Long plot depth = {stepInitialValue["og_part_w"] / 2 - stepInitialValue["path_off_grid_width"] / 2}
                                <br></br>
                                Short plot depth = {stepInitialValue["og_part_w"] / 2 - stepInitialValue["path_os_w"] / 2}
                              </div>
                            </>
                          )
                        }
                      />

                      <Step
                        title="Programme"
                        description={
                          step.get(1) === 4 && (
                            <>
                              {renderFormItem("perc_open_space", "Open space (%)", range(0, 10), "%")}
                              <div>
                                Open space area = {round2((stepInitialValue["perc_open_space"] / 100) * siteArea())} Ha
                                <p></p>
                              </div>
                              {renderFormItem("perc_amenities", "Ammenities (%)", range(0, 10), "%")}
                              <div>
                                Ammenities area = {round2((stepInitialValue["perc_amenities"] / 100) * siteArea())} Ha
                                <br></br>
                              </div>
                            </>
                          )
                        }
                      />
                    </Steps>
                  )
                }
              />

              {/* =============================================================================== */}

              <Step
                title="Tissue"
                description={
                  mainStep === 2 && (
                    <Steps direction="vertical" current={step.get(2)} onChange={onChangeSub} className="substep" size="small">
                      <Step
                        title="Plots Along Arteries"
                        description={
                          step.get(2) === 0 && (
                            <>
                              {renderFormItem("plot_art_width", "Width", range(3, 30), "m")}
                              {renderFormItem("plot_art_sb_f", "Front setback", range(0, 12), "m")}
                              {renderFormItem("plot_art_sb_b", "Rear setback", range(0, 12), "m")}
                              {renderFormItem("plot_art_sb_s", "Side margins", range(0, 12), "m")}
                              {renderFormItem("plot_art_floors", "Number of floors", range(1, 12), "m")}
                            </>
                          )
                        }
                      />

                      <Step
                        title="Plots Along Secondaries"
                        description={
                          step.get(2) === 1 && (
                            <>
                              {renderFormItem("plot_sec_width", "Width", range(3, 30), "m")}
                              {renderFormItem("plot_sec_sb_f", "Front setback", range(0, 12), "m")}
                              {renderFormItem("plot_sec_sb_b", "Rear setback", range(0, 12), "m")}
                              {renderFormItem("plot_sec_sb_s", "Side margins", range(0, 12), "m")}
                              {renderFormItem("plot_sec_floors", "Number of floors", range(1, 12), "m")}
                            </>
                          )
                        }
                      />

                      <Step
                        title="Plots Along Local Roads"
                        description={
                          step.get(2) === 2 && (
                            <>
                              {renderFormItem("plot_ter_width", "Width", range(3, 30), "m")}
                              {renderFormItem("plot_ter_sb_f", "Front setback", range(0, 12), "m")}
                              {renderFormItem("plot_ter_sb_b", "Rear setback", range(0, 12), "m")}
                              {renderFormItem("plot_ter_sb_s", "Side margins", range(0, 12), "m")}
                              {renderFormItem("plot_ter_floors", "Number of floors", range(1, 12), "m")}
                            </>
                          )
                        }
                      />

                      <Step
                        title="Off-grid Clusters"
                        description={
                          step.get(2) === 3 && (
                            <>
                              {renderFormItem("path_entry_width", "Access path width", range(2, 12), "m")}
                              {renderFormItem("path_off_grid_width", "Internal path width", range(2, 12), "m")}
                              {renderFormItem("path_os_w", "Open space width", range(0, 40), "m")}
                              {renderFormItem("path_os_l", "Open space length", range(0, 60), "m")}
                              {/* insert plot depth */}
                              <div>
                                Long plot depth = {stepInitialValue["og_part_w"] / 2 - stepInitialValue["path_off_grid_width"] / 2}
                                <br></br>
                                Short plot depth = {stepInitialValue["og_part_w"] / 2 - stepInitialValue["path_os_w"] / 2}
                              </div>
                            </>
                          )
                        }
                      />

                      <Step
                        title="Plots in off-grid Clusters"
                        description={
                          step.get(2) === 4 && (
                            <>
                              {renderFormItem("plot_off_grid_width", "Plot width", range(3, 30), "m")}
                              {renderFormItem("plot_og_sb_f", "Front setback", range(0, 12), "m")}
                              {renderFormItem("plot_og_sb_b", "Rear setback", range(0, 12), "m")}
                              {renderFormItem("plot_og_sb_s", "Side margins", range(0, 12), "m")}
                              {renderFormItem("plot_og_floors", "Number of floors", range(1, 12), "m")}
                            </>
                          )
                        }
                      />
                    </Steps>
                  )
                }
              />

              {/* =============================================================================== */}

              <Step title="Buildings" />

              {/* =============================================================================== */}

              <Step title="Dwellings" />

              {/* =============================================================================== */}
            </Steps>
            <Button type="primary" htmlType="submit" style={{ marginLeft: "100px" }}>
              Apply
            </Button>
          </Form>
        ) : (
          <Common.Loading />
        )}
      </Wrapper>
    );
  })
);

export default StepComp;
