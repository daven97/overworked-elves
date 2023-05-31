import React, { useCallback, useEffect, useState } from 'react';

import { Form as FormikForm, FormikErrors, FormikProps, useFormikContext, withFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';

import debounce from 'just-debounce-it';

import calculateHours from '../data/hoursCalculation';

import '../assets/stylesheets/form.css';

import { FormValues } from '../shared/types';
import classNames from 'classnames';
import calculatePopulationDensity from '../data/densityCalculation';
import NumDisplay from './NumDisplay';

interface FormGroupParams {
  fieldName: keyof FormValues;
  formProps: FormikProps<FormValues>;
  inputType: 'text' | 'number' | 'select';
  selectValues?: string[];
};

// const formValueInputTypeMapping =  {
//   numElves: 'number',
//   hoursPerToy: 'number',
//   toysPerChild: 'number'
// };

const getFieldNameDisplayString = (fieldName: keyof FormValues): string => {
  switch (fieldName) {
    case 'hoursPerToy':
      return 'Hours per Toy';
    case 'numElves':
      return 'Number of Elves';
    case 'toysPerChild':
      return 'Toys per Child';
  }
};

// const FormControl = ({ }): JSX.Element => {

// };

const FormGroup = ({ fieldName, inputType, formProps, selectValues }: FormGroupParams): JSX.Element => {
  const { handleBlur, handleChange, values, touched, errors } = formProps;
  const field_errors = errors[fieldName];
  const displayErrors = touched[fieldName] && !!field_errors;

  return (
    <Form.Group controlId="formHoursPerToy" className="form-group">
      <Form.Label>{getFieldNameDisplayString(fieldName)}</Form.Label>
      <Form.Control
        name={fieldName}
        type={inputType}
        onBlur={handleBlur}
        onChange={handleChange}
        value={values[fieldName]}
      />
      <Form.Control.Feedback className={classNames('form-field-error', 'text-danger', { 'invisible': !displayErrors })} type="invalid">{field_errors || "blank"}</Form.Control.Feedback>
    </Form.Group>
  );
};

const InnerForm = (props: FormikProps<FormValues>): JSX.Element => {
  const { handleSubmit } = props;
  const { values, submitForm } = useFormikContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSubmitForm = useCallback(debounce(() => submitForm(), 300), [submitForm]);

  // Automatically submit the form 
  useEffect(() => {
    debounceSubmitForm();
  }, [values, debounceSubmitForm]);

  return (
    <FormikForm>
      {/* We have to use the 'as' prop becuase rendering a form within a form is considered invalid html */}
      <Form as="div" onSubmit={handleSubmit}>
        <FormGroup fieldName="hoursPerToy" inputType="number" formProps={props} />
        <FormGroup fieldName="numElves" inputType="number" formProps={props} />
        <FormGroup fieldName="toysPerChild" inputType="number" formProps={props} />
      </Form>
    </FormikForm>
  );
};

interface FormProps {
  initialNumElves: number;
  initialHoursPerToy: number;
  initialToysPerChild: number;
  setHoursPerDay: React.Dispatch<React.SetStateAction<number>>;
  setNumDays: React.Dispatch<React.SetStateAction<number>>;
  setPopulationDensity: React.Dispatch<React.SetStateAction<number>>;
  setTotalHours: React.Dispatch<React.SetStateAction<number>>;
}

// Wrap our form with the withFormik HoC
const FormInstance = withFormik<FormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: props => {
    return {
      hoursPerToy: props.initialHoursPerToy || 0,
      numElves: props.initialNumElves || 0,
      toysPerChild: props.initialToysPerChild || 0,
    };
  },

  // Add a custom validation function (this can be async too!)
  validate: (values: FormValues) => {
    let errors: FormikErrors<FormValues> = {};

    // hoursPerToy
    if (!values.hoursPerToy) {
      errors.hoursPerToy = 'Please enter a number';
    } else if (values.hoursPerToy <= 0) {
      errors.hoursPerToy = 'Must be a positive number';
    }

    // numElves
    if (!values.numElves) {
      errors.numElves = 'Christmas cannot go on without elves! Please enter a number';
    } else if (values.numElves <= 0) {
      errors.numElves = 'Must be a positive number';
    }

    // toysPerChild
    if (!values.toysPerChild) {
      errors.toysPerChild = 'Children cannot feel the Christmas spirit without toys! Please enter a number';
    } else if (values.toysPerChild <= 0) {
      errors.toysPerChild = 'Must be a positive number';
    }


    return errors;
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    const { setHoursPerDay, setNumDays, setPopulationDensity } = props;
    const { hoursPerDay: newHoursPerDay, numDays: newNumDays } = calculateHours(values);
    const populationDensity = calculatePopulationDensity(values.numElves);

    setHoursPerDay(newHoursPerDay);
    setNumDays(newNumDays);
    setPopulationDensity(populationDensity);
    setSubmitting(false);
  },
})(InnerForm);

const OverworkedElvesForm = (): JSX.Element => {
  const initialValues: FormValues = {
    numElves: 5_000_000,
    hoursPerToy: 3,
    toysPerChild: 2
  };
  const { hoursPerDay: initialHoursPerDay, numDays: initialNumDays, totalHours: initialTotalHours } = calculateHours(initialValues);
  const initialPopulationDensity = calculatePopulationDensity(initialValues.numElves);

  const [hoursPerDay, setHoursPerDay] = useState(initialHoursPerDay);
  const [numDays, setNumDays] = useState(initialNumDays);
  const [totalHours, setTotalHours] = useState(initialTotalHours);
  const [populationDensity, setPopulationDensity] = useState(initialPopulationDensity);

  const hoursPerDayThresholdValues = { thresholdValue: 8, secondaryThresholdValue: 24 };

  return (
    <div className="content-wrapper">
      {/* TODO: Better name for this class */}
      <div className="header-text">
        <h2>
          Santa's elves are forced to work for
          {/* Each elf only needs to work for */}
          <NumDisplay value={hoursPerDay} thresholdValues={hoursPerDayThresholdValues} />
          hours each day for
          {/* hours per day for */}
          <NumDisplay value={numDays} />
          days each year.
        </h2>
        <h2>
          They live with a population density of
          {/* days this year! */}
          <NumDisplay value={populationDensity} />
          elves/mi².
        </h2>
        <h2>
          That's only
          <NumDisplay value={hoursPerDay * numDays} />
          total hours per elf! (
          <NumDisplay value={totalHours} spacePadded={false} />
          total hours)
        </h2>
      </div>
      {/* TODO: Better classname here */}
      <div className="form-wrapper">
        <div className="form-container">
          <FormInstance
            initialNumElves={initialValues.numElves}
            initialHoursPerToy={initialValues.hoursPerToy}
            initialToysPerChild={initialValues.toysPerChild}
            setHoursPerDay={setHoursPerDay}
            setNumDays={setNumDays}
            setPopulationDensity={setPopulationDensity}
            setTotalHours={setTotalHours}
          />
          <br />
        </div>
      </div>
    </div>
  );
};

export default OverworkedElvesForm;