import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function UCSBSubjectForm({
  initialUCSBSubject,
  submitAction,
  buttonLabel = 'Create',
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialUCSBSubject || {} });
  // Stryker enable all

  const navigate = useNavigate();

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-Subjecttime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable next-line Regex
  const isoSubject_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

  // Stryker disable next-line all
  const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialUCSBSubject && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid="UCSBSubjectForm-id"
            id="id"
            type="text"
            {...register('id')}
            value={initialUCSBSubject.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="quarterYYYYQ">Quarter YYYYQ</Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-quarterYYYYQ"
          id="quarterYYYYQ"
          type="text"
          isInvalid={Boolean(errors.quarterYYYYQ)}
          {...register('quarterYYYYQ', {
            required: true,
            pattern: yyyyq_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.quarterYYYYQ && 'QuarterYYYYQ is required. '}
          {errors.quarterYYYYQ?.type === 'pattern' &&
            'QuarterYYYYQ must be in the format YYYYQ, e.g. 20224 for Fall 2022'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-name"
          id="name"
          type="text"
          isInvalid={Boolean(errors.name)}
          {...register('name', {
            required: 'Name is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="localSubjectTime">Subject (iso format)</Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-localSubjectTime"
          id="localSubjectTime"
          type="text"
          isInvalid={Boolean(errors.localSubjectTime)}
          {...register('localSubjectTime', {
            required: true,
            pattern: isoSubject_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.localSubjectTime && 'LocalSubjectTime is required. '}
          {errors.localSubjectTime?.type === 'pattern' &&
            'localSubjectTime must be in ISO format, e.g. 2022-01-02T15:30'}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid="UCSBSubjectForm-submit">
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid="UCSBSubjectForm-cancel"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UCSBSubjectForm;