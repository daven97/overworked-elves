const KM_TO_MI = 0.621371;
const ARTIC_MINIMUM_AREA_KM_SQ = 4_720_000;
const ARTIC_MINIMUM_AREA_MI_SQ = ARTIC_MINIMUM_AREA_KM_SQ * (KM_TO_MI ** 2);

const calculatePopulationDensity = (numElves: number): number => {
  return numElves / ARTIC_MINIMUM_AREA_MI_SQ;
};

export default calculatePopulationDensity;