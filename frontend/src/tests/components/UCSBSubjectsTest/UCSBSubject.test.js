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

  test('Correct Error messsages on bad input', async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <UCSBSubjectForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('UCSBSubjectForm-quarterYYYYQ')).toBeInTheDocument()
    );
    const quarterYYYYQField = getByTestId('UCSBSubjectForm-quarterYYYYQ');
    const localSubjectTimeField = getByTestId(
      'UCSBSubjectForm-localSubjectTime'
    );
    const submitButton = getByTestId('UCSBSubjectForm-submit');

    fireEvent.change(quarterYYYYQField, { target: { value: 'bad-input' } });
    fireEvent.change(localSubjectTimeField, { target: { value: 'bad-input' } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        getByText(/QuarterYYYYQ must be in the format YYYYQ/)
      ).toBeInTheDocument()
    );
    expect(
      getByText(/localSubjectTime must be in ISO format/)
    ).toBeInTheDocument();
  });

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
      expect(getByText(/QuarterYYYYQ is required./)).toBeInTheDocument()
    );
    expect(getByText(/Name is required./)).toBeInTheDocument();
    expect(getByText(/LocalSubjectTime is required./)).toBeInTheDocument();
  });

  test('No Error messsages on good input', async () => {
    const mockSubmitAction = jest.fn();

    const { getByTestId, queryByText } = render(
      <Router>
        <UCSBSubjectForm submitAction={mockSubmitAction} />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('UCSBSubjectForm-quarterYYYYQ')).toBeInTheDocument()
    );

    const quarterYYYYQField = getByTestId('UCSBSubjectForm-quarterYYYYQ');
    const nameField = getByTestId('UCSBSubjectForm-name');
    const localSubjectTimeField = getByTestId(
      'UCSBSubjectForm-localSubjectTime'
    );
    const submitButton = getByTestId('UCSBSubjectForm-submit');

    fireEvent.change(quarterYYYYQField, { target: { value: '20221' } });
    fireEvent.change(nameField, { target: { value: 'noon on January 2nd' } });
    fireEvent.change(localSubjectTimeField, {
      target: { value: '2022-01-02T12:00' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      queryByText(/QuarterYYYYQ must be in the format YYYYQ/)
    ).not.toBeInTheDocument();
    expect(
      queryByText(/localSubjectTime must be in ISO format/)
    ).not.toBeInTheDocument();
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
