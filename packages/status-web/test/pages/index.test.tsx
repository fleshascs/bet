import React from 'react';
import { render } from '@testing-library/react';
import A from '../../pages/a';

describe('Home page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<A />, {});
    expect(asFragment()).toMatchSnapshot();
  });

  // it('clicking button triggers alert', () => {
  //   const { getByText } = render(<Home />, {});
  //   window.alert = jest.fn();
  //   fireEvent.click(getByText('Test Button'));
  //   expect(window.alert).toHaveBeenCalledWith('With typescript and Jest');
  // });
});
