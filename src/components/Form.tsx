import React, { useState } from 'react';

import { Form as FormikForm, FormikErrors, FormikHandlers, FormikProps, withFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';

import calculateHours from '../data/hoursCalculation';

import '../assets/stylesheets/form.css';

import { FormValues } from '../shared/types';

interface FormGroupParams {
  fieldName: keyof FormValues;
  formProps: FormikProps<FormValues>;
  inputType: 'text' | 'number';
}

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
}

const FormGroup = ({ fieldName, inputType, formProps }: FormGroupParams): JSX.Element => {
  const { handleBlur, handleChange, values, touched, errors } = formProps;
  console.log(errors);
  const field_errors = errors[fieldName];

  // const debounceHandleChange = (): FormikHandlers['handleChange'] {

  // }

  return (
    <Form.Group controlId="formHoursPerToy" >
      <Form.Label>{getFieldNameDisplayString(fieldName)}</Form.Label>
      <Form.Control
        name={fieldName}
        type={inputType}
        onBlur={handleBlur}
        onChange={handleChange}
        value={values[fieldName]}
      />
      {touched[fieldName] && field_errors && <Form.Control.Feedback className="form-field-error" type="invalid">{field_errors}</Form.Control.Feedback>}
    </Form.Group>
  );
};

const InnerForm = (props: FormikProps<FormValues>): JSX.Element => {
  const { handleSubmit } = props;
  return (
    <FormikForm>
      {/* We have to use the 'as' prop becuase rendering a form within a form is considered invalid html */}
      <Form as="div" onSubmit={handleSubmit}>
        <FormGroup fieldName="hoursPerToy" inputType="number" formProps={props} />
        <FormGroup fieldName="numElves" inputType="number" formProps={props} />
        <FormGroup fieldName="toysPerChild" inputType="number" formProps={props} />


        {/* <button type="submit" disabled={isSubmitting}>
          Submit
        </button> */}
      </Form>
    </FormikForm>
  );
};

// The type of props MyForm receives
interface FormProps {
  initialNumElves: number;
  initialHoursPerToy: number;
  initialToysPerChild: number;
  setHoursPerDay: React.Dispatch<React.SetStateAction<number>>;
  setNumDays: React.Dispatch<React.SetStateAction<number>>;
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
      errors.hoursPerToy = 'Required';
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
    const { setHoursPerDay, setNumDays } = props;
    const { hoursPerDay: newHoursPerDay, numDays: newNumDays } = calculateHours(values);

    setHoursPerDay(newHoursPerDay);
    setNumDays(newNumDays);
    setSubmitting(false);
  },
})(InnerForm);

const OverworkedElvesForm = (): JSX.Element => {
  const initialValues: FormValues = {
    numElves: 5000000,
    hoursPerToy: 3,
    toysPerChild: 2
  };
  const { hoursPerDay: initialHoursPerDay, numDays: initialNumDays, totalHours: initialTotalHours } = calculateHours(initialValues);
  const [hoursPerDay, setHoursPerDay] = useState(initialHoursPerDay);
  const [numDays, setNumDays] = useState(initialNumDays);
  const [totalHours, setTotalHours] = useState(initialTotalHours);

  return (
    <div className="content-wrapper">
      {/* TODO: Better name for this class */}
      <div className="header-text">
        <h2>
          Santa's elves are forced to work for
          {/* Each elf only needs to work for */}
          <strong className="text-danger">
            &nbsp;{+hoursPerDay.toFixed(2)}&nbsp;
          </strong>
          hours each day for
          {/* hours per day for */}
          <strong className="text-danger">
            &nbsp;{numDays}&nbsp;
          </strong>
          days each year.
          {/* days this year! */}
        </h2>
        <h2>
          That's only
          <strong className="text-danger">
            &nbsp;{hoursPerDay * numDays}&nbsp;
          </strong>
          total hours per elf! (
          <strong className="text-danger">
            {totalHours}
          </strong> total hours)
        </h2>
      </div>
      <div className="form-container">
        <FormInstance
          initialNumElves={initialValues.numElves}
          initialHoursPerToy={initialValues.hoursPerToy}
          initialToysPerChild={initialValues.toysPerChild}
          setHoursPerDay={setHoursPerDay}
          setNumDays={setNumDays}
          setTotalHours={setTotalHours}
        />
        <br />
      </div>
    </div>
  );
};

export default OverworkedElvesForm;