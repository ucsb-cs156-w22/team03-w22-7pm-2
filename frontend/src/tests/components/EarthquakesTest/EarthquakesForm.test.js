import { render, waitFor, fireEvent } from '@testing-library/react';
import EarthquakesForm from 'main/components/Earthquakes/EarthquakesForm';
import { earthquakesFixtures } from 'fixtures/earthquakesFixtures';
import { BrowserRouter as Router } from 'react-router-dom';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('EarthquakesForm tests', () => {
  test('renders correctly ', async () => {
    const { getByText } = render(
      <Router>
        <EarthquakesForm />
      </Router>
    );
    // await waitFor(() => expect(getByText(/Quarter YYYYQ/)).toBeInTheDocument());
    await waitFor(() => expect(getByText(/Retrieve/)).toBeInTheDocument());
  });

  // test('renders correctly when passing in an Earthquake', async () => {
  //   const { getByText, getByTestId } = render(
  //     <Router>
  //       <EarthquakesForm
  //         initialEarthquakes={earthquakesFixtures.twoEarthquakes}
  //       />
  //     </Router>
  //   );
  //   await waitFor(() =>
  //     expect(
  //       getByTestId(/EarthquakesForm-distanceFromStorke/)
  //     ).toBeInTheDocument()
  //   );
  //   expect(getByText(/distanceFromStorke/)).toBeInTheDocument();
  //   expect(getByTestId(/EarthquakesForm-distanceFromStorke/)).toHaveValue('5');
  // });

  test('Correct Error messsages on missing input', async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <EarthquakesForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('EarthquakesForm-submit')).toBeInTheDocument()
    );
    const submitButton = getByTestId('EarthquakesForm-submit');

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(getByText(/Distance is required./)).toBeInTheDocument()
    );
    expect(getByText(/Magnitude is required./)).toBeInTheDocument();
  });

  test('No Error messsages on good input', async () => {
    const mockSubmitAction = jest.fn();

    const { getByTestId, queryByText } = render(
      <Router>
        <EarthquakesForm submitAction={mockSubmitAction} />
      </Router>
    );
    await waitFor(() =>
      expect(
        getByTestId('EarthquakesForm-distanceFromStorke')
      ).toBeInTheDocument()
    );

    const distanceFromStorkeField = getByTestId(
      'EarthquakesForm-distanceFromStorke'
    );

    const minMagField = getByTestId('EarthquakesForm-minMag');

    const submitButton = getByTestId('EarthquakesForm-submit');

    fireEvent.change(distanceFromStorkeField, { target: { value: '5' } });
    fireEvent.change(minMagField, {
      target: { value: '6.9' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(queryByText(/Distance is required./)).not.toBeInTheDocument();
    expect(queryByText(/Magnitude is required./)).not.toBeInTheDocument();
  });

  test('Test that navigate(-1) is called when Cancel is clicked', async () => {
    const { getByTestId } = render(
      <Router>
        <EarthquakesForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('EarthquakesForm-cancel')).toBeInTheDocument()
    );
    const cancelButton = getByTestId('EarthquakesForm-cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
