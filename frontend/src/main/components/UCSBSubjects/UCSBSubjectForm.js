
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


      <Form.Group className="mb-3">
        <Form.Label htmlFor="inactive">
          Inactive
        </Form.Label>
        <Form.Control
          data-testid="UCSBSubjectForm-inactive"
          id="inactive"
          type="text"
          isInvalid={Boolean(errors.inactive)}
          {...register('inactive', {
            required: 'inactive is required.',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.inactive?.message}
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

// // @ts-nocheck
// function stryNS_9fa48() {
//     var g = new Function("return this")();
//     var ns = g.__stryker__ || (g.__stryker__ = {});
  
//     if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
//       ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
//     }
  
//     function retrieveNS() {
//       return ns;
//     }
  
//     stryNS_9fa48 = retrieveNS;
//     return retrieveNS();
//   }
  
//   stryNS_9fa48();
  
//   function stryCov_9fa48() {
//     var ns = stryNS_9fa48();
//     var cov = ns.mutantCoverage || (ns.mutantCoverage = {
//       static: {},
//       perTest: {}
//     });
  
//     function cover() {
//       var c = cov.static;
  
//       if (ns.currentTestId) {
//         c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
//       }
  
//       var a = arguments;
  
//       for (var i = 0; i < a.length; i++) {
//         c[a[i]] = (c[a[i]] || 0) + 1;
//       }
//     }
  
//     stryCov_9fa48 = cover;
//     cover.apply(null, arguments);
//   }
  
//   function stryMutAct_9fa48(id) {
//     var ns = stryNS_9fa48();
  
//     function isActive(id) {
//       if (ns.activeMutant === id) {
//         if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
//           throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
//         }
  
//         return true;
//       }
  
//       return false;
//     }
  
//     stryMutAct_9fa48 = isActive;
//     return isActive(id);
//   }
  
//   import React, { useState } from 'react';
//   import { Button, Form } from 'react-bootstrap';
//   import { useForm } from 'react-hook-form';
//   import { useNavigate } from 'react-router-dom';
  
//   function UCSBSubjectsForm({
//     initialUCSBSubject,
//     submitAction,
//     buttonLabel = stryMutAct_9fa48("218") ? "" : (stryCov_9fa48("218"), "Create")
//   }) {
//     if (stryMutAct_9fa48("219")) {
//       {}
//     } else {
//       stryCov_9fa48("219");
//       // Stryker disable all
//       const {
//         register,
//         formState: {
//           errors
//         },
//         handleSubmit
//       } = useForm({
//         defaultValues: initialUCSBSubject || {}
//       }); // Stryker enable all
  
//       const navigate = useNavigate(); // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
//       // Note that even this complex regex may still need some tweaks
//       // Stryker disable next-line Regex
  
//       const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i; // Stryker disable next-line all
  
//       const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.
  
//       return <Form onSubmit={handleSubmit(submitAction)}>
  
//               {initialUCSBSubject && <Form.Group className="mb-3">
//                       <Form.Label htmlFor="id">Id</Form.Label>
//                       <Form.Control data-testid="UCSBSubjectsForm-id" id="id" type="text" {...register("id")} value={initialUCSBSubject.id} disabled />
//                   </Form.Group>}
  
//               <Form.Group className="mb-3">
//                   <Form.Label htmlFor="subjectCode">Subject Code</Form.Label>
//                   <Form.Control data-testid="UCSBSubjectsForm-subjectCode" id="subjectCode" type="text" isInvalid={Boolean(errors.subjectCode)} {...register("subjectCode", {
//             required: true
//           })} />
//                   <Form.Control.Feedback type="invalid">
//                       {errors.subjectCode && 'SubjectCode is required.'}
//                   </Form.Control.Feedback>
//               </Form.Group>
  
//               <Form.Group className="mb-3">
//                   <Form.Label htmlFor="subjectTranslation">Subject Translation</Form.Label>
//                   <Form.Control data-testid="UCSBSubjectsForm-subjectTranslation" id="subjectTranslation" type="text" isInvalid={Boolean(errors.subjectTranslation)} {...register("subjectTranslation", {
//             required: true
//           })} />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.subjectTranslation && 'SubjectTranslation is required.'}
//                   </Form.Control.Feedback>
//               </Form.Group>
  
//               <Form.Group className="mb-3">
//                   <Form.Label htmlFor="deptCode">Dept Code</Form.Label>
//                   <Form.Control data-testid="UCSBSubjectsForm-deptCode" id="deptCode" type="text" isInvalid={Boolean(errors.deptCode)} {...register("deptCode", {
//             required: true
//           })} />
//                   <Form.Control.Feedback type="invalid">
//                       {errors.deptCode && 'DeptCode is required.'}
//                   </Form.Control.Feedback>
//               </Form.Group>
  
//               <Form.Group className="mb-3">
//                   <Form.Label htmlFor="collegeCode">College Code</Form.Label>
//                   <Form.Control data-testid="UCSBSubjectsForm-collegeCode" id="collegeCode" type="text" isInvalid={Boolean(errors.collegeCode)} {...register("collegeCode", {
//             required: true
//           })} />
//                   <Form.Control.Feedback type="invalid">
//                       {errors.collegeCode && 'CollegeCode is required.'}
//                   </Form.Control.Feedback>
//               </Form.Group>
  
//               <Form.Group className="mb-3">
//                   <Form.Label htmlFor="relatedDeptCode">Related Dept Code</Form.Label>
//                   <Form.Control data-testid="UCSBSubjectsForm-relatedDeptCode" id="relatedDeptCode" type="text" isInvalid={Boolean(errors.relatedDeptCode)} {...register("relatedDeptCode", {
//             required: true
//           })} />
//                   <Form.Control.Feedback type="invalid">
//                       {errors.relatedDeptCode && 'RelatedDeptCode is required.'}
//                   </Form.Control.Feedback>
//               </Form.Group>
  
//               <Form.Group className="mb-3">
//                   <Form.Label htmlFor="inactive">Inactive</Form.Label>
//                   <Form.Control data-testid="UCSBSubjectsForm-inactive" id="inactive" type="text" isInvalid={Boolean(errors.inactive)} {...register("inactive", {
//             required: true
//           })} />
//                   <Form.Control.Feedback type="invalid">
//                       {errors.inactive && 'Inactive is required.'}
//                   </Form.Control.Feedback>
//               </Form.Group>
  
//               <Button type="submit" data-testid="UCSBSubjectsForm-submit">
//                   {buttonLabel}
//               </Button>
//               <Button variant="Secondary" onClick={() => navigate(-1)} data-testid="UCSBSubjectsForm-cancel">
//                   Cancel
//               </Button>
  
//           </Form>;
//     }
//   }
  
//   export default UCSBSubjectsForm;