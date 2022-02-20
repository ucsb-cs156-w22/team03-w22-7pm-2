import { render, waitFor, fireEvent } from '@testing-library/react';
import UCSBSubjectForm from 'main/components/UCSBSubjects/UCSBSubjectForm';
import { ucsbSubjectsFixtures } from 'fixtures/ucsbSubjectsFixtures';
import { BrowserRouter as Router } from 'react-router-dom';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('UCSBSubjectForm tests', () => {
  test('renders correctly ', async () => {
    const { getByText } = render(
      <Router>
        <UCSBSubjectForm />
      </Router>
    );
    // await waitFor(() => expect(getByText(/Quarter YYYYQ/)).toBeInTheDocument());
    await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
  });

  test('renders correctly when passing in a UCSBSubject ', async () => {
    const { getByText, getByTestId } = render(
      <Router>
        <UCSBSubjectForm initialUCSBSubject={ucsbSubjectsFixtures.oneSubject} />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId(/UCSBSubjectForm-id/)).toBeInTheDocument()
    );
    expect(getByText(/Id/)).toBeInTheDocument();
    expect(getByTestId(/UCSBSubjectForm-id/)).toHaveValue('1');
  });
  /**
  test('Correct Error messsages on bad input', async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <UCSBSubjectForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('UCSBSubjectForm-subjectCode')).toBeInTheDocument()
    );
    const subjectCodeField = getByTestId('UCSBSubjectForm-subjectCode');
    const submitButton = getByTestId('UCSBSubjectForm-submit');
    fireEvent.change(subjectCodeField, { target: { value: 'bad-input' } });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(getByText(/subjectCode is required/)).toBeInTheDocument()
    );
    expect(getByText(/subjectTranslation is required/)).toBeInTheDocument();
    expect(getByText(/deptCode is required/)).toBeInTheDocument();
    expect(getByText(/collegeCode is required/)).toBeInTheDocument();
    expect(getByText(/relatedDeptCode is required/)).toBeInTheDocument();
  });
  */

  test('Correct Error messsages on missing input', async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <UCSBSubjectForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('UCSBSubjectForm-submit')).toBeInTheDocument()
    );
    const submitButton = getByTestId('UCSBSubjectForm-submit');

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(getByText(/subjectCode is required./)).toBeInTheDocument()
    );
    expect(getByText(/subjectTranslation is required./)).toBeInTheDocument();
    expect(getByText(/deptCode is required./)).toBeInTheDocument();
    expect(getByText(/collegeCode is required./)).toBeInTheDocument();
    expect(getByText(/relatedDeptCode is required./)).toBeInTheDocument();
    expect(getByText(/inactive is required./)).toBeInTheDocument();

  });

  test('No Error messsages on good input', async () => {
    const mockSubmitAction = jest.fn();

    const { getByTestId, queryByText } = render(
      <Router>
        <UCSBSubjectForm submitAction={mockSubmitAction} />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('UCSBSubjectForm-subjectCode')).toBeInTheDocument()
    );

    const subjectCodeField = getByTestId('UCSBSubjectForm-subjectCode');
    const subjectTranslationField = getByTestId(
      'UCSBSubjectForm-subjectTranslation'
    );
    const deptCodeField = getByTestId('UCSBSubjectForm-deptCode');
    const collegeCodeField = getByTestId('UCSBSubjectForm-collegeCode');
    const relatedDeptCodeField = getByTestId('UCSBSubjectForm-relatedDeptCode');
    const inactiveField = getByTestId('UCSBSubjectForm-inactive');

    const submitButton = getByTestId('UCSBSubjectForm-submit');

    fireEvent.change(subjectCodeField, { target: { value: 'A' } });
    fireEvent.change(subjectTranslationField, { target: { value: 'English Language' },});
    fireEvent.change(deptCodeField, {target: { value: 'English' },});
    fireEvent.change(collegeCodeField, { target: { value: 'L&S' } });
    fireEvent.change(relatedDeptCodeField, { target: { value: 'Letters & Sciences' }, });
    fireEvent.change(inactiveField, { target: { value: false },});
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(queryByText(/subjectCode is required./)).not.toBeInTheDocument();
    expect(
      queryByText(/subjectTranslation is required./)
    ).not.toBeInTheDocument();
    expect(queryByText(/deptCode is required./)).not.toBeInTheDocument();
    expect(queryByText(/collegeCode is required./)).not.toBeInTheDocument();
    expect(queryByText(/relatedDeptCode is required./)).not.toBeInTheDocument();
    expect(queryByText(/inactive is required./)).not.toBeInTheDocument();

  });

  test('Test that navigate(-1) is called when Cancel is clicked', async () => {
    const { getByTestId } = render(
      <Router>
        <UCSBSubjectForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('UCSBSubjectForm-cancel')).toBeInTheDocument()
    );
    const cancelButton = getByTestId('UCSBSubjectForm-cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
