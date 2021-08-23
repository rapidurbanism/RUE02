import { action, observable, computed } from "mobx";
import { StepParams } from "./types";

interface TSummaryExtra {
  after: number;
  cost: number;
  price: number;
  surplus: number;
  subsidy: number;
  loss: number;
  developer: number;
}

export class UIState {
  @observable pTitle = "Default";
  @action.bound
  setProjectTitle(v: string) {
    this.pTitle = v;
  }
  @computed get projectTitle() {
    return this.pTitle;
  }

  @observable surplusLoss: number = 0;
  @action.bound
  setSurplusLoss(value: number) {
    this.surplusLoss = value;
  }

  @observable summaryExtra: TSummaryExtra = {
    after: 0,
    cost: 0,
    price: 0,
    surplus: 0,
    subsidy: 0,
    loss: 0,
    developer: 0,
  };
  @action.bound
  setSummaryExtra(data: TSummaryExtra) {
    this.summaryExtra = data;
  }

  @observable mobiusUpdated: boolean = false;
  @action.bound
  setMobiusUpdated(value: boolean) {
    this.mobiusUpdated = value;
  }

  @observable dashboardProcessing: boolean = true;
  @action.bound
  setDashboardProcessing(value: boolean) {
    this.dashboardProcessing = value;
  }

  @observable sideMenuVisible: boolean = false;
  @action.bound
  setSideMenuVisible(value: boolean) {
    this.sideMenuVisible = value;
  }

  @observable financeShouldUpdate: boolean = false;
  @action.bound
  setFinanceShouldUpdate(value: boolean) {
    this.financeShouldUpdate = value;
  }

  @observable financeTableSaving: boolean = false;
  @action.bound
  setFinanceTableSaving(value: boolean) {
    this.financeTableSaving = value;
  }

  @observable fullWidth: number = 0;
  @observable sideWidth: number = 400;
  @observable hideWidth: number = 0;

  @observable financialTableVisible: boolean = false;

  @observable financeCompView: string = "sideupdate";
  @action.bound
  toggleFinanceView(view: string, width?: number) {
    if (view.includes("full")) {
      this.financialTableVisible = true;
      this.fullWidth = width!;
      this.sideWidth = 0;
      this.hideWidth = 0;
    } else if (view.includes("side")) {
      this.financialTableVisible = false;
      this.fullWidth = 0;
      this.sideWidth = 400;
      this.hideWidth = 0;
    } else if (view.includes("hide")) {
      this.fullWidth = 0;
      this.sideWidth = 0;
      this.hideWidth = 32;
    }
    this.financeCompView = view;
    // this.setFinanceShouldUpdate(false)
  }

  @observable currentStep: { mainStep: number; subStep: number } = { mainStep: 0, subStep: 0 };

  @observable step: Map<number, number> = new Map([[0, 0]]);
  @action.bound
  setStep(mainStep: number, subStep?: number) {
    if (subStep) {
      this.step.set(mainStep, subStep);
    } else {
      this.step.set(mainStep, 0);
    }
    this.currentStep = Object.assign({}, this.currentStep, { mainStep: mainStep, subStep: subStep === undefined ? 0 : subStep });
  }

  @observable stepParams: StepParams = {
    longitude: 85.77832,
    latitude: 20.23269,
    rotation: -92,
    site_front_dim: 600,
    site_back_dim: 550,
    site_back_shift: 60,
    site_sides_dim: 600,
    pop_density: 400,
    // open_space_ratio: 5,
    // commercial_ratio: 5,
    // manufacturing_ratio: 5,
    // kin_area_pp: 5,
    // kin_min_p: 200,
    // kin_pop_ratio: 5,
    // prim_area_pp: 5,
    // prim_min_p: 200,
    // prim_pop_ratio: 5,
    // sec_area_pp: 5,
    // sec_min_p: 200,
    // sec_pop_ratio: 5,
    // adu_area_pp: 5,
    // adu_min_p: 200,
    // adu_pop_ratio: 5,

    local_along_art: 100,
    local_along_sec: 130,
    local_along_local: 170,
    road_art_w: 24,
    road_sec_w: 18,
    road_ter_w: 12,
    art_part_d: 30,
    sec_part_d: 24,
    ter_part_d: 18,
    og_part_w: 30,
    og_part_d: 30,
    perc_open_space: 5,
    perc_amenities: 5,

    plot_art_width: 20,
    plot_art_sb_f: 6,
    plot_art_sb_b: 3,
    plot_art_sb_s: 3,
    plot_art_floors: 4,
    plot_sec_width: 20,
    plot_sec_sb_f: 3,
    plot_sec_sb_b: 3,
    plot_sec_sb_s: 3,
    plot_sec_floors: 3,
    plot_ter_width: 10,
    plot_ter_sb_f: 0,
    plot_ter_sb_b: 3,
    plot_ter_sb_s: 0,
    plot_ter_floors: 2,
    plot_off_grid_width: 12,
    path_entry_width: 4.5,
    path_off_grid_width: 4.5,
    path_os_w: 9,
    path_os_l: 18,
    plot_og_sb_f: 0,
    plot_og_sb_b: 3,
    plot_og_sb_s: 0,
    plot_og_floors: 2,
  };

  @action.bound
  setStepParams(v: StepParams) {
    this.stepParams = v;
  }

  @computed get stepInitialValue() {
    return this.stepParams;
  }

  
}
