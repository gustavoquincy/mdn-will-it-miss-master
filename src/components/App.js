import React from 'react';
import { useAsync } from 'react-async-hook';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import Orbital from './Orbital';

function getDate(d = new Date()) {
  return d.toJSON().split('T')[0];
}


const fetchData = () =>
  fetch(
    `https://ssd-api.jpl.nasa.gov/cad.api?neo="true"&date-min=${getDate()}&&api-key="nZCgQPQRm78qdVwSH3JSE4WDLk4GBlN3DbY6UU9b"`
  ).then((res) => res.json());

export default function App() {
  const data = useAsync(fetchData, []);

  console.log(data);

  if (data.loading) {
    document.title = 'Counting potential earth HAZARDS…';

    return (
      <p>
        Getting data from NASA right now to check whether something from space
        is going to hit us. One moment…
      </p>
    );
  }

  const day = getDate(addDays(new Date(), 1));
  const hazards = data.result.near_earth_objects[day].reduce((acc, curr) => {
    if (curr.is_potentially_hazardous_asteroid) {
      return acc + 1;
    }
    return acc;
  }, 0);

  document.title = `${hazards} potential HAZARDS ${hazards > 0 ? '😱' : '👍'}`;

  const results = data.result.near_earth_objects[day];
  return (
    <div>
      <p>
        {format(addDays(new Date(), 1), 'EEEE d-MMM')} there will be{' '}
        <strong>{results.length}</strong> near misses
      </p>
      <hr></hr>
      {results
        .sort((a) => (a.is_potentially_hazardous_asteroid ? -1 : 1))
        .map((data) => (
          <Orbital key={data.id} {...data} />
        ))}
    </div>
  );
}
