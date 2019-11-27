import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import toJSON from 'enzyme-to-json';

import Nav from '../components/Nav';
import { CURRENT_USER_QUERY, LOCAL_STATE_QUERY } from '../hooks';
import { fakeUser, updateWrapper, fakeCartItem } from '../lib/testUtils';

const notSignedInMocks = [
  { request: { query: CURRENT_USER_QUERY }, result: { data: { me: null } } },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: { data: { cartOpen: false } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: { data: { cartOpen: false } },
  },
];
const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
        },
      },
    },
  },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: { data: { cartOpen: false } },
  },
];

describe('<Nav />', () => {
  it('renders a minimal nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await updateWrapper(wrapper);

    const nav = wrapper.find('ul[data-test="nav"]');

    expect(toJSON(nav)).toMatchSnapshot();
  });

  it('renders a full nav when signin', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await updateWrapper(wrapper);

    const nav = wrapper.find('ul[data-test="nav"]');

    expect(nav.children()).toHaveLength(6);
    expect(nav.text()).toContain('Sign Out');

    // expect(toJSON(nav)).toMatchSnapshot();
  });

  it('renders the amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    );

    await updateWrapper(wrapper);

    const nav = wrapper.find('ul[data-test="nav"]');
    const count = nav.find('div.count');

    expect(toJSON(count)).toMatchSnapshot();
  });
});
