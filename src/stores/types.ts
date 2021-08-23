export interface TMobiusResults {
  model?: string;
  site_area?: number | undefined;
  road_art_length?: number | undefined;
  road_sec_length?: number | undefined;
  road_ter_length?: number | undefined;
  parts_art_art_area?: number | undefined;
  parts_art_sec_area?: number | undefined;
  parts_art_ter_area?: number | undefined;
  parts_art_area?: number | undefined;
  parts_sec_sec_area?: number | undefined;
  parts_sec_ter_area?: number | undefined;
  parts_sec_area?: number | undefined;
  parts_ter_ter_area?: number | undefined;
  parts_ter_area?: number | undefined;
  pub_open_area?: number | undefined;
  road_art_area?: number | undefined;
  road_sec_area?: number | undefined;
  road_ter_area?: number | undefined;
  [key: string]: string | number | undefined;
}

export interface TCostsSubtotals {
  off_site: number;
  land: number;
  site: number;
  arteries: number;
  secondaries: number;
  tertiaries: number;
  on_site: number;
  open_spaces: number;
  other: number;
  [key: string]: number;
}

export interface TRevenuesSubtotals {
  arteries: number;
  secondaries: number;
  local_roads: number;
  off_grid: number;
  public_lands: number;
  [key: string]: number;
}

export interface StepParams {
  longitude: number;
  latitude: number;
  rotation: number;
  site_front_dim: number;
  site_back_dim: number;
  site_back_shift: number;
  site_sides_dim: number;
  pop_density: number;
  // open_space_ratio: number;
  // commercial_ratio: number;
  // manufacturing_ratio: number;
  // kin_area_pp: number;
  // kin_min_p: number;
  // kin_pop_ratio: number;
  // prim_area_pp: number;
  // prim_min_p: number;
  // prim_pop_ratio: number;
  // sec_area_pp: number;
  // sec_min_p: number;
  // sec_pop_ratio: number;
  // adu_area_pp: number;
  // adu_min_p: number;
  // adu_pop_ratio: number;

  local_along_art: number;
  local_along_sec: number;
  local_along_local: number;
  road_art_w: number;
  road_sec_w: number;
  road_ter_w: number;
  art_part_d: number;
  sec_part_d: number;
  ter_part_d: number;
  og_part_w: number;
  og_part_d: number;
  perc_open_space: number;
  perc_amenities: number;

  plot_art_width: number;
  plot_art_sb_f: number;
  plot_art_sb_b: number;
  plot_art_sb_s: number;
  plot_art_floors: number;
  plot_sec_width: number;
  plot_sec_sb_f: number;
  plot_sec_sb_b: number;
  plot_sec_sb_s: number;
  plot_sec_floors: number;
  plot_ter_width: number;
  plot_ter_sb_f: number;
  plot_ter_sb_b: number;
  plot_ter_sb_s: number;
  plot_ter_floors: number;
  plot_off_grid_width: number;
  path_entry_width: number;
  path_off_grid_width: number;
  path_os_w: number;
  path_os_l: number;
  plot_og_sb_f: number;
  plot_og_sb_b: number;
  plot_og_sb_s: number;
  plot_og_floors: number;

  [key: string]: any;
}
