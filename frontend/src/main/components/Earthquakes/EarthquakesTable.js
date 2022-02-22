import React from 'react';
import OurTable from 'main/components/OurTable';

export default function EarthquakesTable({ earthquakes, currentUser }) {
  // Stryker enable all
  const columns = [
    {
      Header: 'Title',
      accessor: (row) => (
        <a href={row.properties.url}>{row.properties.title}</a>
      ),
      id: 'properties.title',
    },
    {
      Header: 'Magnitude',
      accessor: 'properties.mag',
    },
    {
      Header: 'Place',
      accessor: 'properties.place',
    },
    {
      Header: 'Time',
      accessor: 'properties.time',
    },
  ];

  // Stryker disable ArrayDeclaration : [columns] and [Earthquakes] are performance optimization; mutation preserves correctness
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const memoizedEarthquakes = React.useMemo(() => earthquakes, [earthquakes]);
  // Stryker enable ArrayDeclaration

  return (
    <OurTable
      data={memoizedEarthquakes}
      columns={memoizedColumns}
      testid={'EarthquakesTable'}
    />
  );
}
