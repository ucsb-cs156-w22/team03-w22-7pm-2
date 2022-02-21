import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function EarthquakesForm({
  initialEarthquakes,
  submitAction,
  buttonLabel = 'Create',
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
      {initialEarthquakes && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid="EarthquakesForm-id"
            id="id"
            type="text"
            {...register('id')}
            value={initialEarthquakes.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="title">Title</Form.Label>
        <Form.Control
          data-testid="EarthquakesForm-title"
          id="title"
          type="text"
          isInvalid={Boolean(errors.title)}
          {...register('title', {
            required: true,
            pattern: yyyyq_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title && 'Title is required. '}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="mag">Magnitude</Form.Label>
        <Form.Control
          data-testid="EarthquakesForm-mag"
          id="mag"
          type="text"
          isInvalid={Boolean(errors.name)}
          {...register('mag', {
            required: 'Magnitude is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="places">Date (iso format)</Form.Label>
        <Form.Control
          data-testid="EarthquakesForm-places"
          id="places"
          type="text"
          isInvalid={Boolean(errors.places)}
          {...register('places', {
            required: true,
            pattern: isodate_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.places && 'places is required. '}
          {errors.places?.type === 'pattern' &&
            'places must be in ISO format, e.g. 2022-01-02T15:30'}
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
