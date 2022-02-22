import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CollegiateSubredditsEditPage from "main/pages/CollegiateSubreddits/CollegiateSubredditsEditPage"

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
            id: 17
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
            axiosMock.onGet("/api/CollegiateSubredditsEditPage", { params: { id: 1 } }).timeout();
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
            await waitFor(() => expect(getByText("Edit CollegiateSubreddits")).toBeInTheDocument());
            expect(queryByTestId("CollegiateSubredditsForm-name")).not.toBeInTheDocument();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/collegiatesubreddits", { params: { id: 11 } }).reply(200, {
                id: 1,
                name: "name",
                location: 'location',
                subreddits: "subreddits"
            });
            axiosMock.onPut('/api/collegiatesubreddits').reply(200, {
                id: 1,
                name: "name",
                location: 'location',
                subreddits: "subreddits"
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

            await waitFor(() => expect(getByTestId("CollegiateSubredditsForm-name")).toBeInTheDocument());

            const idField = getByTestId("CollegiateSubredditsForm-id");
            const nameField = getByTestId("CollegiateSubredditsForm-name");
            const locationField = getByTestId("CollegiateSubredditsForm-location");
            const subredditsField = getByTestId("CollegiateSubredditsForm-subreddits");
            const submitButton = getByTestId("CollegiateSubredditsForm-submit");

            expect(idField).toHaveValue("1");
            expect(nameField).toHaveValue("name");
            expect(locationField).toHaveValue("location");
            expect(subredditsField).toHaveValue("subreddits");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CollegiateSubredditsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("CollegiateSubredditsForm-name")).toBeInTheDocument());

            const idField = getByTestId("CollegiateSubredditsForm-id");
            const nameField = getByTestId("CollegiateSubredditsForm-name");
            const locationField = getByTestId("CollegiateSubredditsForm-location");
            const subredditsField = getByTestId("CollegiateSubredditsForm-subreddits");
            const submitButton = getByTestId("CollegiateSubredditsForm-submit");


            expect(idField).toHaveValue("1");
            expect(nameField).toHaveValue("name");
            expect(locationField).toHaveValue("location");
            expect(subredditsField).toHaveValue("subreddits");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'New name' } })
            fireEvent.change(locationField, { target: { value: "UCSB" } })
            fireEvent.change(subredditsField, { target: { value: "UCSB subreddits" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("CollegiateSubreddits Updated - id: 2 name: UCSB subreddits");
            expect(mockNavigate).toBeCalledWith({ "to": "/collegiatesubreddits/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'New name',
                location: "UCSB",
                subreddits: "UCSB subreddits"
            })); // posted object

        });

       
    });
});


