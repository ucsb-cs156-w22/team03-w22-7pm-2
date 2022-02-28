import { fireEvent, queryAllByRole, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CollegiateSubredditsEditPage from "main/pages/CollegiateSubreddits/CollegiateSubredditsEditPage";

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
        useParams: () => ({
            id: 99
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CollegiateSubredditsEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/collegiateSubreddits", { params: { id: 99 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CollegiateSubredditsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit CollegiateSubreddit")).toBeInTheDocument());
            expect(queryByTestId("CollegiateSubredditsForm-location")).not.toBeInTheDocument();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/collegiateSubreddits", { params: { id: 99 } }).reply(200, {
                id: 99,
                name: "Test Name 1",
                location: "Test Location 1",
                subreddit: "Test subreddit 1"
            });
            axiosMock.onPut('/api/collegiateSubreddits').reply(200, {
                id: "99",
                name: "Test Name 2",
                location: "Test Location 2",
                subreddit: "Test subreddit 2"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CollegiateSubredditsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CollegiateSubredditsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("CollegiateSubredditsForm-location")).toBeInTheDocument());

            const idField = getByTestId("CollegiateSubreddit-id");
            const nameField = getByTestId("CollegiateSubredditsForm-name");
            const locationField = getByTestId("CollegiateSubredditsForm-location");
            const subredditField = getByTestId("CollegiateSubredditsForm-subreddit");
            const submitButton = getByTestId("CollegiateSubredditsForm-submit");

            expect(idField).toHaveValue("99");
            expect(nameField).toHaveValue("Test Name 1");
            expect(locationField).toHaveValue("Test Location 1");
            expect(subredditField).toHaveValue("Test subreddit 1");
        });

        test("Changes when you click Update", async () => {
            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CollegiateSubredditsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("CollegiateSubredditsForm-location")).toBeInTheDocument());

            const idField = getByTestId("CollegiateSubreddit-id");
            const nameField = getByTestId("CollegiateSubredditsForm-name");
            const locationField = getByTestId("CollegiateSubredditsForm-location");
            const subredditField = getByTestId("CollegiateSubredditsForm-subreddit");
            const submitButton = getByTestId("CollegiateSubredditsForm-submit");

            expect(idField).toHaveValue("99");
            expect(nameField).toHaveValue("Test Name 1");
            expect(locationField).toHaveValue("Test Location 1");
            expect(subredditField).toHaveValue("Test subreddit 1");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Test Name 2' } })
            fireEvent.change(locationField, { target: { value: 'Test Location 2' } })
            fireEvent.change(subredditField, { target: { value: "Test subreddit 2" } })
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("CollegiateSubreddit Updated - id: 99 name: Test Name 2");
            expect(mockNavigate).toBeCalledWith({ "to": "/collegiatesubreddits/list" });

            expect(axiosMock.history.put.length).toBe(1);
            expect(axiosMock.history.put[0].params).toEqual({ id: 99 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "Test Name 2",
                location: 'Test Location 2',
                subreddit: "Test subreddit 2"
            }));
        });
    });
});