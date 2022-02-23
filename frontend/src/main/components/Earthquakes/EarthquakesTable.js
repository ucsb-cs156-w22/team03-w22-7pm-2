import React from 'react';
import OurTable from 'main/components/OurTable';

export default function EarthquakesTable({ earthquakes, currentUser }) {
  // Stryker disable all : hard to test for query caching
  // Stryker enable all
  // Stryker disable next-line all
  const columns = [
    {
      Header: 'id',
      accessor: 'id', // accessor is the "key" in the data
      id: 'id',
    },
    {
      Header: 'Title',
      accessor: (row) => (
        <a href={row.properties.url}>{row.properties.title}</a>
      ),
      id: 'title',
    },
    {
      Header: 'Magnitude',
      accessor: 'properties.mag',
      id: 'mag',
    },
    {
      Header: 'Place',
      accessor: 'properties.place',
      id: 'place',
    },
    {
      Header: 'Time',
      accessor: 'properties.time',
      id: 'time',
    },
  ];

  // Stryker disable ArrayDeclaration : [columns] and [Earthquakes] are performance optimization; mutation preserves correctness
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const memoizedEarthquakes = React.useMemo(() => earthquakes, [earthquakes]);

  return (
    <OurTable
      data={memoizedEarthquakes}
      columns={memoizedColumns}
      testid={'EarthquakesTable'}
    />
  );
}
