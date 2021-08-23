import { action, computed, observable } from "mobx";
import { TMobiusResults } from "./types";

export class MobiusStore {
  @observable postMessageData: object | boolean = false;
  @action.bound
  setpostMessageData(v: object) {
    this.postMessageData = v;
  }

  // models-stable-ver, models-gamma-ver, models-delta-ver
  host = "https://iauai-20200725170124-hostingbucket-dev.s3.amazonaws.com/models-stable-ver/";
  file = "city.mob";
  @observable initialModel = this.host + this.file;

  @observable model = this.host + this.file;
  @action.bound
  setModel(v: string) {
    this.model = v;
  }

  @observable mobiusResults: TMobiusResults = {
    site_area: 0,
    off_grid_area: 0,
    road_art_length: 0,
    road_sec_length: 0,
    road_ter_length: 0,
    parts_art_art_area: 0,
    parts_art_sec_area: 0,
    parts_art_ter_area: 0,
    parts_art_area: 0,
    parts_sec_sec_area: 0,
    parts_sec_ter_area: 0,
    parts_sec_area: 0,
    parts_ter_ter_area: 0,
    parts_ter_area: 0,
    pub_open_area: 0,
    pub_amenities: 0, // added by patrick
    road_art_area: 0,
    road_sec_area: 0,
    road_ter_area: 0,
    // target_area_park: 0,
    // target_area_comm: 0,
    // target_area_manu: 0,
    // target_area_kin: 0,
    // target_area_prim: 0,
    // target_area_sec: 0,
    // target_area_adu: 0,
  };

  @computed
  public get modelResultData() {
    return this.mobiusResults;
  }

  @action.bound
  setMobiusResult(v: object) {
    this.mobiusResults = Object.assign(this.mobiusResults, v);
  }

  @observable GeoJSON: string = "{}";
  @action.bound
  setGeoJSON(v: string) {
    this.GeoJSON = v;
  }
  @computed get getGeoJSON() {
    return this.GeoJSON;
  }

  @observable CurrentGeoJSON: string = "";
  @action.bound
  setCurrentGeoJSON(v: string) {
    this.CurrentGeoJSON = v;
  }

  @observable GeoJsonList: Array<string> = [];
  @action.bound
  addToGeoJSONList(v: string) {
    this.GeoJsonList.push(v);
  }
  @action.bound
  removeFromGeoJSONList(v: string) {
    this.GeoJsonList = this.GeoJsonList.filter((value) => value !== v);
  }
}
