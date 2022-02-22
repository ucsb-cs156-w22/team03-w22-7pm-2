import { render, waitFor, fireEvent } from '@testing-library/react';
import EarthquakesRetrievePage from 'main/pages/Earthquakes/EarthquakesRetrievePage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe('EarthquakesRetrievePage tests', () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet('/api/currentUser')
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet('/api/systemInfo')
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test('renders without crashing', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesRetrievePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test('when you fill in the form and hit submit, it makes a request to the backend', async () => {
    const queryClient = new QueryClient();
    const earthquake = {
      distanceFromStorke: 5,
      minMag: 6.9,
    };

    axiosMock.onPost('/api/earthquakes/retrieve').reply(202, earthquake);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesRetrievePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        getByTestId('EarthquakesForm-distanceFromStorke')
      ).toBeInTheDocument();
    });

    const distanceFromStorkeField = getByTestId(
      'EarthquakesForm-distanceFromStorke'
    );
    const minMagField = getByTestId('EarthquakesForm-minMag');
    const submitButton = getByTestId('EarthquakesForm-submit');

    fireEvent.change(distanceFromStorkeField, { target: { value: '5' } });
    fireEvent.change(minMagField, {
      target: { value: '6.9' },
    });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      minMag: '6.9',
      distanceFromStorke: '5',
    });

    expect(mockToast).toBeCalledWith('1 Earthquakes retrieved');
    expect(mockNavigate).toBeCalledWith({ to: '/earthquakes/list' });
  });
});
