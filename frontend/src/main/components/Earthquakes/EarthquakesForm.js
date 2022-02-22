import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function EarthquakesForm({
  initialEarthquakes,
  submitAction,
  buttonLabel = 'Retrieve',
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialEarthquakes || {} });
  // Stryker enable all

  const navigate = useNavigate();

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable next-line Regex
  //   const isodate_regex =
  //     /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

  //   // Stryker disable next-line all
  //   const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="distanceFromStorke">
          Distance in km from Storke Tower{' '}
        </Form.Label>
        <Form.Control
          data-testid="EarthquakesForm-distanceFromStorke"
          id="distanceFromStorke"
          type="text"
          isInvalid={Boolean(errors.title)}
          {...register('distanceFromStorke', {
            required: true,
            pattern: yyyyq_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title && 'Distance is required. '}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="minMag">Minimum Magnitude</Form.Label>
        <Form.Control
          data-testid="EarthquakesForm-minMag"
          id="minMag"
          type="text"
          isInvalid={Boolean(errors.name)}
          {...register('minMag', {
            required: 'Magnitude is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid="EarthquakesForm-submit">
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid="EarthquakesForm-cancel"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default EarthquakesForm;
