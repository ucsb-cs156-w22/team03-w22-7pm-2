import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';
import EarthquakesForm from 'main/components/Earthquakes/EarthquakesForm';
import { Navigate } from 'react-router-dom';
import { useBackendMutation } from 'main/utils/useBackend';
import { toast } from 'react-toastify';

export default function EarthquakesCreatePage() {
  const objectToAxiosParams = (earthquakes) => ({
    url: '/api/earthquakes/retrieve',
    method: 'POST',
    params: {
      distanceFromStorke: earthquakes.distanceFromStorke,
      minMag: earthquakes.minMag,
    },
  });

  const onSuccess = (earthquakes) => {
    toast(
      `New Earthquakes Created - Distance from Storke: ${earthquakes.distanceFromStorke} km Minimum Magnitude: ${earthquakes.minMag}`
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ['/api/earthquakes/all']
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return <Navigate to="/earthquakes/list" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Earthquakes</h1>

        <EarthquakesForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
