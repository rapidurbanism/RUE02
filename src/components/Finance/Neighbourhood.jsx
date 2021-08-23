import React, { useEffect, useState } from "react";
import { useStores } from "@stores/index";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { fs } from 'memfs';
import { useIdleTimer } from 'react-idle-timer'
import { updateDashboard } from "./function"

const updateData = (mobiusData) => {
  const t0 = performance.now();

  const _data = JSON.parse(fs.readFileSync('/neighbourhood.data', 'utf8'));
  const celldata = _data.celldata
  const costs = celldata.filter((d) => d.c === 4 && d.r < 17)
  costs.find((d) => d.r === 6).v.v = mobiusData.site_area / 10000; // Land acquisition
  costs.find((d) => d.r === 8).v.v = mobiusData.site_area / 10000; // Site preparation
  costs.find((d) => d.r === 12).v.v = mobiusData.road_art_length // Arteries (main roads)
  costs.find((d) => d.r === 14).v.v = mobiusData.road_sec_length // Secondaries (distributor roads)
  costs.find((d) => d.r === 16).v.v = mobiusData.road_ter_length // Tertiaries (access and local roads)

  const revenues = celldata.filter((d) => d.c === 6 && 34 < d.r < 89)
  //private
  revenues.find((d) => d.r === 35).v.v = mobiusData.parts_art_art_area
  revenues.find((d) => d.r === 37).v.v = mobiusData.parts_art_sec_area
  revenues.find((d) => d.r === 39).v.v = mobiusData.parts_art_ter_area
  revenues.find((d) => d.r === 41).v.v = mobiusData.parts_art_area
  revenues.find((d) => d.r === 45).v.v = mobiusData.parts_sec_sec_area
  revenues.find((d) => d.r === 47).v.v = mobiusData.parts_sec_ter_area
  revenues.find((d) => d.r === 49).v.v = mobiusData.parts_sec_area
  revenues.find((d) => d.r === 53).v.v = mobiusData.parts_ter_ter_area
  revenues.find((d) => d.r === 55).v.v = mobiusData.parts_ter_area
  revenues.find((d) => d.r === 59).v.v = mobiusData.off_grid_area

  //public
  revenues.find((d) => d.r === 68).v.v = mobiusData.pub_amenities
  revenues.find((d) => d.r === 78).v.v = mobiusData.pub_open_area
  revenues.find((d) => d.r === 84).v.v = mobiusData.road_art_area
  revenues.find((d) => d.r === 86).v.v = mobiusData.road_sec_area
  revenues.find((d) => d.r === 88).v.v = mobiusData.road_ter_area

  const newData = Object.assign({}, _data, { celldata: celldata });
  console.log('NEW DATA', newData);
  fs.writeFileSync('/neighbourhood.data', JSON.stringify(newData));
  const t1 = performance.now();
  console.log("Luckysheet Update Mobius Data", `Duration:${t1 - t0}`);
  return [newData]
}

const Neighbourhood = observer(() => {
  const { uiState, mobiusStore, neighbourhoodStore } = useStores();
  const { financeCompView, mobiusUpdated, setMobiusUpdated, setSummaryExtra, setFinanceTableSaving, financialTableVisible, setDashboardProcessing } = uiState;
  const { mobiusResults } = mobiusStore
  const { LSCreated, setLSCreated } = neighbourhoodStore

  useEffect(() => {
    // const luckysheet = window.luckysheet;
    // if (!financeCompView.includes("update")) {
    //   if (financialTableVisible) {
    //     luckysheet.resize()
    //   }
    //   return
    // } else {
    //   if (luckysheet.getluckysheetfile()) {
    //     luckysheet.resize()
    //   }
    // }

    const luckysheet = window.luckysheet;
    if (mobiusUpdated) {
      luckysheet.destroy();

      const mobiusData = toJS(mobiusResults)
      const _data = updateData(mobiusData)
      luckysheet.create({
        container: "luckysheet",
        data: _data,
        showinfobar: false,
        showtoolbar: false,
        showsheetbar: false,
        showstatisticBar: false,
        // allowEdit: false,
        forceCalculation: true,
      });

      setLSCreated(true)
      // luckysheet.setCellValue(88, 6, mobiusData.road_ter_area)
      setTimeout(() => {
        luckysheet.jfrefreshgrid();
      }, 1200);

      setTimeout(() => {
        updateDashboard(luckysheet, neighbourhoodStore, setSummaryExtra)
        setDashboardProcessing(false)
      }, 1500);
      setMobiusUpdated(false)
    }
  }, [mobiusUpdated])

  useEffect(() => {
    const luckysheet = window.luckysheet;
    if (luckysheet.getluckysheetfile()) {
      if (!financeCompView.includes("update")) {
        if (financialTableVisible) {
          luckysheet.resize()
        }
        return
      } else {
        luckysheet.resize()
      }
    }
  }, [financialTableVisible])

  const doAutoSave = event => {
    const luckysheet = window.luckysheet;
    if (luckysheet.getluckysheetfile()) {
      console.log("AUTOSAVE_SAVING", performance.now())
      setFinanceTableSaving(true)
      const file = luckysheet.getluckysheetfile();
      const newFile = Object.assign({}, file[0], {
        celldata: luckysheet.getGridData(file[0].data),
        data: [],
      });
      fs.writeFile('/neighbourhood.data', JSON.stringify(newFile), {}, () => {
        setTimeout(() => {
          updateDashboard(luckysheet, neighbourhoodStore, setSummaryExtra)
          setFinanceTableSaving(false)
        }, 500);
      })
    }
  }

  useIdleTimer({
    timeout: 1000,
    onIdle: doAutoSave,
    debounce: 500
  })

  return <div id="luckysheet" style={{
    margin: "0px",
    padding: "0px",
    position: "absolute",
    width: "100%",
    height: "100%",
    left: "0px",
    top: "0px",
  }}></div>;
});

export default Neighbourhood;
