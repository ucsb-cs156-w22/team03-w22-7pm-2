import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CollegiateSubredditsForm from "main/components/CollegiateSubreddits/CollegiateSubredditsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CollegiateSubredditsCreatePage() {

  const objectToAxiosParams = (collegiatesubreddits) => ({
    url: "/api/collegiateSubreddits/post",
    method: "POST",
    params: {
      name: collegiatesubreddits.name,
      location: collegiatesubreddits.location,
      subreddits: collegiatesubreddits.subreddits
    }
  });

  const onSuccess = (collegiatesubreddits) => {
    toast(`New collegiateSubreddits Created - id: ${collegiatesubreddits.id} name: ${collegiatesubreddits.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/collegiateSubreddits/all"]
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
        <h1>Create New collegiateSubreddits</h1>

        <CollegiateSubredditsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}