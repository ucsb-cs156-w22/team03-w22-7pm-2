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

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialEarthquakes}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="distance">
          Distance in km from Storke Tower{' '}
        </Form.Label>
        <Form.Control
          data-testid="EarthquakesForm-distance"
          id="distance"
          type="text"
          isInvalid={Boolean(errors.distance)}
          {...register('distance', {
            required: 'Distance is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.distance?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="minMag">Minimum Magnitude</Form.Label>
        <Form.Control
          data-testid="EarthquakesForm-minMag"
          id="minMag"
          type="text"
          isInvalid={Boolean(errors.minMag)}
          {...register('minMag', {
            required: 'Magnitude is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.minMag?.message}
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
