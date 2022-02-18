import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function UCSBSubjectsForm({ initialUCSBSubject, submitAction, buttonLabel="Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialUCSBSubject || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialUCSBSubject && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="UCSBSubjectsForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialUCSBSubject.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="subjectCode">Subject Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-subjectCode"
                    id="subjectCode"
                    type="text"
                    isInvalid={Boolean(errors.subjectCode)}
                    {...register("subjectCode", { required: true })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.subjectCode && 'SubjectCode is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="subjectTranslation">Subject Translation</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-subjectTranslation"
                    id="subjectTranslation"
                    type="text"
                    isInvalid={Boolean(errors.subjectTranslation)}
                    {...register("subjectTranslation", {
                        required: "Name is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="deptCode">Dept Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-deptCode"
                    id="deptCode"
                    type="text"
                    isInvalid={Boolean(errors.deptCode)}
                    {...register("deptCode", { required: true })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.deptCode && 'DeptCode is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="collegeCode">CollegeCode</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-collegeCode"
                    id="collegeCode"
                    type="text"
                    isInvalid={Boolean(errors.collegeCode)}
                    {...register("collegeCode", { required: true })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.collegeCode && 'CollegeCode is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="relatedDeptCode">Related Dept Code</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-relatedDeptCode"
                    id="relatedDeptCode"
                    type="text"
                    isInvalid={Boolean(errors.relatedDeptCode)}
                    {...register("relatedDeptCode", { required: true })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.relatedDeptCode && 'RelatedDeptCode is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="inactive">Inactive</Form.Label>
                <Form.Control
                    data-testid="UCSBSubjectsForm-inactive"
                    id="inactive"
                    type="text"
                    isInvalid={Boolean(errors.inactive)}
                    {...register("inactive", { required: true  })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.inactive && 'Inactive is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid="UCSBSubjectsForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="UCSBSubjectsForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default UCSBSubjectsForm;
