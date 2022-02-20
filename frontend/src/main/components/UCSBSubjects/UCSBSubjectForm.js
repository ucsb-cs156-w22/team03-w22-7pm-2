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

  /** Stryker disable next-line Regex
  const isoSubject_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  Stryker disable next-line all
  const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.
*/
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
        <Form.Label htmlFor="subjectCode">Subject Code</Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-subjectCode"
          id="subjectCode"
          type="text"
          isInvalid={Boolean(errors.subjectCode)}
          {...register('subjectCode', {
            required: 'subjectCode is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.subjectCode?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="subjectTranslation">
          Subject Translation
        </Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-subjectTranslation"
          id="subjectTranslation"
          type="text"
          isInvalid={Boolean(errors.subjectTranslation)}
          {...register('subjectTranslation', {
            required: 'subjectTranslation is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.subjectTranslation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="deptCode">Department Code</Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-deptCode"
          id="deptCode"
          type="text"
          isInvalid={Boolean(errors.deptCode)}
          {...register('deptCode', {
            required: 'deptCode is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.deptCode?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="collegeCode">College Code</Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-collegeCode"
          id="collegeCode"
          type="text"
          isInvalid={Boolean(errors.collegeCode)}
          {...register('collegeCode', {
            required: 'collegeCode is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.collegeCode?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="relatedDeptCode">
          Related Department Code
        </Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-relatedDeptCode"
          id="relatedDeptCode"
          type="text"
          isInvalid={Boolean(errors.relatedDeptCode)}
          {...register('relatedDeptCode', {
            required: 'relatedDeptCode is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.relatedDeptCode?.message}
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