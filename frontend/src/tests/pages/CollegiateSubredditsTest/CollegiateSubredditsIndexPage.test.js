import {  render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CollegiateSubredditsIndexPage from "main/pages/CollegiateSubreddits/CollegiateSubredditsIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { CollegiateSubredditsFixtures } from "fixtures/CollegiateSubredditsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

describe("CollegiateSubredditsIndexPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    const testId = "CollegiateSubredditsTable";
    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/collegiateSubreddits/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/collegiateSubreddits/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders three subreddits without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/collegiateSubreddits/all").reply(200, CollegiateSubredditsFixtures.threeSubreddits);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("subreddit 1"); });
        expect(getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("subreddit 2");
        expect(getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("subreddit 3");
    });

    test("renders three subreddits  without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/collegiateSubreddits/all").reply(200, CollegiateSubredditsFixtures.threeSubreddits);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("subreddit 1"); });
        expect(getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("subreddit 2");
        expect(getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("subreddit 3");
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/collegiateSubreddits/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CollegiateSubredditsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/collegiateSubreddits/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });
});