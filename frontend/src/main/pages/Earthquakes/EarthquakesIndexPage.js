import React from 'react';
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';
import EarthquakesTable from 'main/components/Earthquakes/EarthquakesTable';
import { useCurrentUser } from 'main/utils/currentUser';
import { useBackendMutation } from 'main/utils/useBackend';
import { Button } from 'react-bootstrap';
import { onDeleteSuccess } from 'main/utils/EarthquakesUtils';

export default function EarthquakesIndexPage({ buttonLabel = 'Purge' }) {
  const currentUser = useCurrentUser();

  const {
    data: earthquakes,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ['/api/earthquakes/all'],
    { method: 'GET', url: '/api/earthquakes/all' },
    []
  );

  const objectToAxiosParams = () => ({
    url: '/api/earthquakes/purge',
    method: 'POST',
  });

  const deleteMutation = useBackendMutation(
    objectToAxiosParams,
    {
      onSuccess: () => onDeleteSuccess('Earthquakes have been purged'),
    },
    ['/api/earthquakes/all']
  );

  const deleteCallback = async (data) => {
    deleteMutation.mutate(data);
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Earthquakes</h1>
        <EarthquakesTable earthquakes={earthquakes} currentUser={currentUser} />
        <Button
          variant="danger"
          data-testid="EarthquakesIndex-purge"
          type="submit"
          onClick={deleteCallback}
        >
          {buttonLabel}
        </Button>
      </div>
    </BasicLayout>
  );
}
