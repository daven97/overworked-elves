import React from 'react';

import { Form as FormikForm, FormikErrors, FormikProps, withFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';

import '../assets/stylesheets/form.css';

interface FormValues {
  hoursPerToy: number;
  numElves: number;
  toysPerChild: number;
}

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

const getFieldNameDisplayString = (fieldName: keyof FormValues) => {
  switch (fieldName) {
    case 'hoursPerToy':
      return 'Hours per Toy';
    case 'numElves':
      return 'Number of Elves';
    case 'toysPerChild':
      return 'Toys per Child';
  }
}

const FormGroup = ({ fieldName, inputType, formProps }: FormGroupParams) => {
  const { handleBlur, handleChange, values, touched, errors } = formProps;
  const field_errors = errors[fieldName];

  return (<Form.Group controlId="formHoursPerToy" >
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
}

const InnerForm = (props: FormikProps<FormValues>) => {
  const { handleSubmit, isSubmitting } = props;
  return (
    <FormikForm>
      {/* We have to use the 'as' prop becuase rendering a form within a form is considered invalid html */}
      <Form as="div" onSubmit={handleSubmit}>
        <FormGroup fieldName="hoursPerToy" inputType="number" formProps={props} />
        <FormGroup fieldName="numElves" inputType="number" formProps={props} />
        <FormGroup fieldName="toysPerChild" inputType="number" formProps={props} />


        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </Form>
    </FormikForm>
  );
};

// The type of props MyForm receives
interface FormProps {
  initialNumElves: number;
  initialHoursPerToy: number;
  initialToysPerChild: number;
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

  handleSubmit: values => {
    // do submitting things
  },
})(InnerForm);

const OverworkedElvesForm = () => (
  <div>
    <h1>Overworked Elves Calculator</h1>
    <FormInstance initialNumElves={50000} initialHoursPerToy={8} initialToysPerChild={2} />
  </div>
);

export default OverworkedElvesForm;