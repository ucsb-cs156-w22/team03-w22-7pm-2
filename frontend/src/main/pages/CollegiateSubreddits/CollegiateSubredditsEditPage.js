import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CollegiateSubredditsForm from "main/components/CollegiateSubreddits/CollegiateSubredditsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CollegiateSubredditsEditPage() {
  let { id } = useParams();

  const { data: collegiateSubreddits, error: error, status: status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/collegiateSubreddits?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/collegiateSubreddits`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (collegiateSubreddits) => ({
    url: "/api/collegiateSubreddits",
    method: "PUT",
    params: {
      id: collegiateSubreddits.id,
    },
    data: {
      name: collegiateSubreddits.name,
      location: collegiateSubreddits.location,
      subreddit: collegiateSubreddits.subreddit
    }
  });

  const onSuccess = (collegiateSubreddits) => {
    toast(`CollegiateSubreddits Updated - id: ${collegiateSubreddits.id} name: ${collegiateSubreddits.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/collegiateSubreddits?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/collegiateSubreddits/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit CollegiateSubreddits</h1>
        {collegiateSubreddits &&
          <CollegiateSubredditsForm initialCollegiateSubreddits={collegiateSubreddits} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

