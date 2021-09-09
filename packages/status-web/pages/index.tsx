import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { getClient } from '../services/client';
import { execute } from 'apollo-link';
import { buildOperation } from '../queries/numberIncremented';

const Home: FC = () => {
  const [responses, setResponses] = useState([]);
  useEffect(() => {
    const [link] = getClient();

    execute(link, buildOperation()).subscribe({
      next: function saveMatchUpdates({ data }) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setResponses((responses) => [...responses, data.numberIncremented]);
        // eslint-disable-next-line no-console
        console.log('data', data);
      },
      // eslint-disable-next-line no-console
      error: (error) => console.log(error, 'onUpdateSportEvent received error'),
      // eslint-disable-next-line no-console
      complete: () => console.log(' onUpdateSportEvent complete')
    });
  }, []);
  return (
    <ul>
      {responses.map((r) => (
        <li key={r}>{r}</li>
      ))}

      <li>
        <Link href='/a' as='/a'>
          <a>a</a>
        </Link>
      </li>
      <li>
        <Link href='/b' as='/b'>
          <a>b</a>
        </Link>
      </li>
    </ul>
  );
};

export default Home;
