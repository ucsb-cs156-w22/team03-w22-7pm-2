import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDateUtils"//might need change?
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDatesTable({ dates, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/collegiatesubreddits/edit/${cell.row.values.id}`)//changed
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/collegiatesubreddits/all"]//changed
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [//changed the inner properties
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Location',
            accessor: 'location',
        },
        {
            Header: 'Subreddit',
            accessor: 'subreddit',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "CollegiateSubredditsTable"));//changed
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "CollegiateSubredditsTable"));//changed
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() => dates, [dates]);

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"CollegiateSubredditsTable"}//changed
    />;
};