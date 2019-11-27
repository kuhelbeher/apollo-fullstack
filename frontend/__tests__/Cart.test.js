import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';

import Cart from '../components/Cart';
import { CURRENT_USER_QUERY, LOCAL_STATE_QUERY } from '../hooks';
import { fakeUser, fakeCartItem, updateWrapper } from '../lib/testUtils';

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()],
        },
      },
    },
  },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: { data: { cartOpen: true } },
  },
];

describe('<Cart/>', () => {
  it('renders and matches snappy', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>
    );

    await updateWrapper(wrapper);

    expect(toJSON(wrapper.find('header'))).toMatchSnapshot();
    expect(wrapper.find('CartItem')).toHaveLength(1);
  });
});
