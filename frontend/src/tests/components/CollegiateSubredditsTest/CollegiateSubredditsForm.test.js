import { render, waitFor, fireEvent } from "@testing-library/react";
import CollegiateSubredditsForm from "main/components/CollegiateSubreddits/CollegiateSubredditsForm";
import { CollegiateSubredditsFixtures } from "fixtures/CollegiateSubredditsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("CollegiateSubredditsForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <CollegiateSubredditsForm />
            </Router>
        );
        //await waitFor(() => expect(getByText(/Quarter YYYYQ/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in a CollegiateSubredditsForm ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <CollegiateSubredditsForm initialCollegiateSubredditsForm={CollegiateSubredditsFixtures.oneSubreddit} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/CollegiateSubredditsForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/CollegiateSubredditsForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <CollegiateSubredditsForm />
            </Router>
        );
        await waitFor(() => expect(getByText("CollegiateSubredditsForm-name")).toBeInTheDocument());
        const nameField = getByText("CollegiateSubredditsForm-name");
        const locationField = getByText("CollegiateSubredditsForm-location");
        const submitButton = getByText("CollegiateSubredditsForm-submit");

        fireEvent.change(nameField, { target: { value: 'bad-input' } });
        fireEvent.change(locationField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/name must be a string/)).toBeInTheDocument());
        expect(getByText(/location must be a string/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <CollegiateSubredditsForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("CollegiateSubredditsForm-submit")).toBeInTheDocument());
        const submitButton = getByTestId("CollegiateSubredditsForm-submit");

        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/Name is required./)).toBeInTheDocument());
        expect(getByText(/Location is required./)).toBeInTheDocument();
        expect(getByText(/Subreddit is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText } = render(
            <Router  >
                <CollegiateSubredditsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await waitFor(() => expect(getByTestId("CollegiateSubredditsForm-name")).toBeInTheDocument());

        const nameField = getByTestId("CollegiateSubredditsForm-name");
        const locationField = getByTestId("CollegiateSubredditsForm-location");
        const subredditsField = getByTestId("CollegiateSubredditsForm-subreddits");
        const submitButton = getByTestId("CollegiateSubredditsForm-submit");

        fireEvent.change(nameField, { target: { value: 'name' } });
        fireEvent.change(locationField, { target: { value: 'location' } });
        fireEvent.change(subredditsField, { target: { value: 'subreddits' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Name must be a string/)).not.toBeInTheDocument();
        expect(queryByText(/Location must be string/)).not.toBeInTheDocument();

    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <CollegiateSubredditsForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("CollegiateSubredditsForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("CollegiateSubredditsForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


