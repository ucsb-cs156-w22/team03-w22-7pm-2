import { fireEvent, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import EarthquakesIndexPage from 'main/pages/Earthquakes/EarthquakesIndexPage';

import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import { earthquakesFixtures } from 'fixtures/earthquakesFixtures';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import mockConsole from 'jest-mock-console';

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe('EarthquakesIndexPage tests', () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = 'EarthquakesTable';

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet('/api/currentUser')
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet('/api/systemInfo')
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet('/api/currentUser')
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet('/api/systemInfo')
      .reply(200, systemInfoFixtures.showingNeither);
  };

  test('renders without crashing for regular user', () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock.onGet('/api/earthquakes/all').reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test('renders without crashing for admin user', () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet('/api/earthquakes/all').reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test('renders 2 earthquakes without crashing for regular user', async () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock
      .onGet('/api/earthquakes/all')
      .reply(200, earthquakesFixtures.twoEarthquakes);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
        'abcd1234abcd1234abcd1234'
      );
    });
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      'abcd5678abcd5678abcd5678'
    );
  });

  test('renders 2 earthquakes without crashing for admin user', async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet('/api/earthquakes/all')
      .reply(200, earthquakesFixtures.twoEarthquakes);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
        'abcd1234abcd1234abcd1234'
      );
    });
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      'abcd5678abcd5678abcd5678'
    );
  });

  test('renders empty table when backend unavailable, user only', async () => {
    setupUserOnly();

    const queryClient = new QueryClient();
    axiosMock.onGet('/api/earthquakes/all').timeout();

    const restoreConsole = mockConsole();

    const { queryByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      'Error communicating with backend via GET on /api/earthquakes/all'
    );
    restoreConsole();

    expect(
      queryByTestId(`${testId}-cell-row-0-col-id`)
    ).not.toBeInTheDocument();
  });

  test('test what happens when you click purge', async () => {
    setupAdminUser();

    const queryClient = new QueryClient();
    axiosMock
      .onGet('/api/earthquakes/all')
      .reply(200, earthquakesFixtures.twoEarthquakes);
    axiosMock
      .onDelete('/api/earthquakes/purge')
      .reply(200, 'Earthquakes have been purged');

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      'abcd1234abcd1234abcd1234'
    );
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      'abcd5678abcd5678abcd5678'
    );
    expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent(
      'M 2.2 - 10km ESE of Ojai, CA'
    );
    expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent(
      'M 6.9 - 21km S of Cupertino, CA'
    );
    expect(getByTestId(`${testId}-cell-row-0-col-mag`)).toHaveTextContent(
      '2.16'
    );
    expect(getByTestId(`${testId}-cell-row-1-col-mag`)).toHaveTextContent(
      '6.9'
    );
    expect(getByTestId(`${testId}-cell-row-0-col-place`)).toHaveTextContent(
      '10km ESE of Ojai, CA'
    );
    expect(getByTestId(`${testId}-cell-row-1-col-place`)).toHaveTextContent(
      '21km S of Cupertino, CA'
    );
    expect(getByTestId(`${testId}-cell-row-0-col-time`)).toHaveTextContent(
      '1644571919000'
    );
    expect(getByTestId(`${testId}-cell-row-1-col-time`)).toHaveTextContent(
      '1844531919000'
    );

    const deleteButton = getByTestId('EarthquakesIndex-purge');
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));

    //expect(mockToast).toBeCalledWith('Earthquakes have been purged');
  });
});
