import React from 'react';

interface ThresholdValues {
  thresholdValue: number;
  secondaryThresholdValue?: number;
};

interface NumDisplayProps {
  spacePadded?: boolean
  thresholdValues?: ThresholdValues;
  value: number;
};

const getTextColorClassName = (value: number, thresholdValues: ThresholdValues | undefined): string => {
  if (!thresholdValues) return 'text-danger';
  const { thresholdValue, secondaryThresholdValue } = thresholdValues;

  if (secondaryThresholdValue) {
    if (value >= secondaryThresholdValue) {
      return 'text-danger';
    } else if (value >= thresholdValue) {
      return 'text-warning';
    } else {
      return 'text-success';
    }
  } else {
    if (value >= thresholdValue) {
      return 'text-danger';
    } else {
      return 'text-success';
    }
  }
};

const NumDisplay = ({ value, spacePadded = true, thresholdValues }: NumDisplayProps): JSX.Element => {

  return (
    <strong className={getTextColorClassName(value, thresholdValues)}>
      {spacePadded && <span>&nbsp;</span>}
      {+value.toFixed(2)}
      <span>&nbsp;</span>
    </strong>
  );
};

export default NumDisplay;