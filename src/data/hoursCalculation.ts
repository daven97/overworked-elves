import { FormValues } from "../shared/types";

import getPopulationCount from "./population"

const WORKING_DAYS_PER_YEAR = 364;

const calculateHours = (values: FormValues): { hoursPerDay: number, numDays: number, totalHours: number } => {
  const numberOfChildren = getPopulationCount('children');
  const totalHours = values.hoursPerToy * values.toysPerChild * numberOfChildren;
  const hoursPerElf = totalHours / values.numElves;
  const numDays = WORKING_DAYS_PER_YEAR;

  const hoursPerDay = hoursPerElf / numDays;


  return { hoursPerDay, numDays, totalHours };
};

export default calculateHours;