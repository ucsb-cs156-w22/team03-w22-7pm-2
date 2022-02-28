import { render, waitFor, fireEvent } from "@testing-library/react";
import CollegiateSubredditsCreatePage from "main/pages/CollegiateSubreddits/CollegiateSubredditsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CollegiateSubredditsCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
        const queryClient = new QueryClient();
        const collegiateSubreddit = {
            id: 99,
            name: "Test Name 1",
            location: "Test Location 1",
            subreddit: "Test Subreddit 1"
        };

        axiosMock.onPost("/api/collegiateSubreddit/post").reply(202, collegiateSubreddit);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("CollegiateSubredditsForm-location")).toBeInTheDocument();
        });

        const nameField = getByTestId("CollegiateSubredditsForm-name");
        const locationField = getByTestId("CollegiateSubredditsForm-location");
        const subredditField = getByTestId("CollegiateSubredditsForm-subreddit");
        const submitButton = getByTestId("CollegiateSubredditsForm-submit");

        fireEvent.change(nameField, { target: { value: 'Test Name 1' } });
        fireEvent.change(locationField, { target: { value: 'Test Location 1' } });
        fireEvent.change(subredditField, { target: { value: 'Test Subreddit 1' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "Test Name 1",
                "subreddit": "Test Subreddit 1",
                "location": "Test Location 1"
            });

        expect(mockToast).toBeCalledWith("New collegiateSubreddit Created - id: 99 name: Test Name 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/collegiatesubreddits/list" });
    });
});
