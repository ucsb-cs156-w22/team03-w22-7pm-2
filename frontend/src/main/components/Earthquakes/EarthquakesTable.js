import React from 'react';
import OurTable from 'main/components/OurTable';
import { Link } from 'react-router-dom';

export default function EarthquakesTable({ students, currentUser }) {
  const columns = [
    {
      Header: 'id',
      accessor: 'id', // accessor is the "key" in the data
    },
    {
      Header: <Link to="/">Go to Aboutpage</Link>,
      accessor: 'title',
    },
    {
      Header: 'Magnitude',
      accessor: 'mag',
    },
    {
      Header: 'Place',
      accessor: 'place',
    },
  ];

  // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const memoizedDates = React.useMemo(() => students, [students]);
  // Stryker enable ArrayDeclaration

  return (
    <OurTable
      data={memoizedDates}
      columns={memoizedColumns}
      testid={'EarthquakesTable'}
    />
  );
}
