export const updateDashboard = (luckysheet, neighbourhoodStore, setSummaryExtra) => {
  const { setCostsDashboard, getCostsDashboard, setRevenuesDashboard, getRevenuesDashboard, setNeighbourhoodUpdated } = neighbourhoodStore;

  const costs = getCostsDashboard,
    revenues = getRevenuesDashboard;

  costs.off_site = luckysheet.getCellValue(4, 12);
  costs.land = luckysheet.getCellValue(6, 12);
  costs.site = luckysheet.getCellValue(8, 12);
  costs.arteries = luckysheet.getCellValue(12, 12);
  costs.secondaries = luckysheet.getCellValue(14, 12);
  costs.tertiaries = luckysheet.getCellValue(16, 12);
  costs.on_site = luckysheet.getCellValue(20, 12);
  costs.open_spaces = luckysheet.getCellValue(22, 12);
  costs.other = luckysheet.getCellValue(24, 12);
  setCostsDashboard(costs);

  revenues.arteries = luckysheet.getCellValue(43, 8);
  revenues.secondaries = luckysheet.getCellValue(51, 8);
  revenues.local_roads = luckysheet.getCellValue(57, 8);
  revenues.off_grid = luckysheet.getCellValue(61, 8);
  revenues.public_lands = luckysheet.getCellValue(92, 8);
  setRevenuesDashboard(revenues);

  const extra = {
    after: luckysheet.getCellValue(286, 2),
    cost: luckysheet.getCellValue(287, 2),
    price: luckysheet.getCellValue(288, 2),
    surplus: luckysheet.getCellValue(289, 2),
    subsidy: luckysheet.getCellValue(290, 2),
    loss: luckysheet.getCellValue(291, 2),
    developer: luckysheet.getCellValue(292, 2),
  };
  setSummaryExtra(extra);
  setNeighbourhoodUpdated(Date.now());
};
