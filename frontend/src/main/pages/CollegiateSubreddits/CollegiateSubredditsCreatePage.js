import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CollegiateSubredditsForm from "main/components/CollegiateSubreddits/CollegiateSubredditsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CollegiateSubredditsCreatePage() {

  const objectToAxiosParams = (ucsbDate) => ({
    url: "/api/collegiatesubreddits/post",
    method: "POST",
    params: {
      name: collegiatesubreddits.name,
      location: collegiatesubreddits.location,
      subreddits: collegiatesubreddits.subreddits
    }
  });

  const onSuccess = (collegiatesubreddits) => {
    toast(`New collegiatesubreddits Created - id: ${collegiatesubreddits.id} name: ${collegiatesubreddits.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/collegiatesubreddits/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/collegiatesubreddits/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New collegiatesubreddits</h1>

        <CollegiateSubredditsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}