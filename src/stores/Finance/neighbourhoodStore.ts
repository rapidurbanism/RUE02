import { action, computed, observable } from "mobx";
import { TCostsSubtotals, TRevenuesSubtotals } from "../types";

export class NeighbourhoodStore {
  @observable CostsDashboard: TCostsSubtotals = {
    off_site: 0,
    land: 0,
    site: 0,
    arteries: 0,
    secondaries: 0,
    tertiaries: 0,
    on_site: 0,
    open_spaces: 0,
    other: 0,
  };

  @action.bound
  setCostsDashboard(v: TCostsSubtotals) {
    this.CostsDashboard = v;
  }

  @computed get getCostsDashboard() {
    return this.CostsDashboard;
  }

  @observable RevenuesDashboard: TRevenuesSubtotals = {
    arteries: 0,
    secondaries: 0,
    local_roads: 0,
    off_grid: 0,
    public_lands: 0,
  };

  @action.bound
  setRevenuesDashboard(v: TRevenuesSubtotals) {
    this.RevenuesDashboard = v;
  }
  @computed get getRevenuesDashboard() {
    return this.RevenuesDashboard;
  }

  @observable NeighbourhoodUpdated: string = "";
  @action.bound
  setNeighbourhoodUpdated(v: string) {
    this.NeighbourhoodUpdated = v;
  }

  @observable LSCreated: boolean = false;
  @action.bound
  setLSCreated(v: boolean) {
    this.LSCreated = v;
  }
}
