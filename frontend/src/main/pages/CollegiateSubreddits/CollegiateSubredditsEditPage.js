import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CollegiateSubredditsForm from "main/components/CollegiateSubreddits/CollegiateSubredditsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CollegiateSubredditsEditPage() {
  let { id } = useParams();

  const { data: CSreddit, error: error, status: status } =
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


  const objectToAxiosPutParams = (CSreddit) => ({
    url: "/api/collegiateSubreddits",
    method: "PUT",
    params: {
      id: CSreddit.id,
    },
    data: {
      name: CSreddit.name,
      location: CSreddit.location,
      subreddit: CSreddit.subreddit
    }
  });

  const onSuccess = (CSreddit) => {
    toast(`CollegiateSubreddit Updated - id: ${CSreddit.id} name: ${CSreddit.name}`);
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
        <h1>Edit CollegiateSubreddit</h1>
        {CSreddit &&
          <CollegiateSubredditsForm initialCollegiateSubreddit={CSreddit} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

