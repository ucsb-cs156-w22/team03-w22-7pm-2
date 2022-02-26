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

    const axiosMock =new AxiosMockAdapter(axios);

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
        const CollegiateSubreddits = {
            id: 1,
            name: "TestnName(CreatePage)",
            location: "TestLocation(CreatePage)",
            subreddit: "TestSubreddit(CreatePage)"
        };

        axiosMock.onPost("/api/collegiateSubreddits/post").reply( 202, CollegiateSubreddits );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("CollegiateSubredditsForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("CollegiateSubredditsForm-name");
        const locationField = getByTestId("CollegiateSubredditsForm-location");
        const subredditField = getByTestId("CollegiateSubredditsForm-subreddit");
        const submitButton = getByTestId("CollegiateSubredditsForm-submit");

        fireEvent.change(nameField, { target: { value: 'TestnName(CreatePage)' } });
        fireEvent.change(locationField, { target: { value: 'TestLocation(CreatePage)' } });
        fireEvent.change(subredditField, { target: { value: 'TestSubreddit(CreatePage)' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "TestnName(CreatePage)",
            "location": "TestLocation(CreatePage)",
            "subreddit": "TestSubreddit(CreatePage)"
        });

        expect(mockToast).toBeCalledWith("New collegiateSubreddits Created - id: 1 name: TestnName(CreatePage)");
        expect(mockNavigate).toBeCalledWith({ "to": "/collegiateSubreddits/list" });
    });


});


