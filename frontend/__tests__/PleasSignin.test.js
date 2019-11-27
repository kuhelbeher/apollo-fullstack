import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';

import PleaseSignIn from '../components/PleaseSignIn';
import { CURRENT_USER_QUERY } from '../hooks';
import { fakeUser, updateWrapper } from '../lib/testUtils';

const notSignedInMocks = [
  { request: { query: CURRENT_USER_QUERY }, result: { data: { me: null } } },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

describe('<PleaseSignIn />', () => {
  it('renders the sign in dialog to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );

    await updateWrapper(wrapper);

    expect(wrapper.text()).toContain('Please Sign In before Continuing');
    expect(wrapper.find('Signin').exists()).toBe(true);
  });

  it('renders the child component when the user is signed in', async () => {
    const Child = () => <p>Child!</p>;

    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Child />
        </PleaseSignIn>
      </MockedProvider>
    );

    await updateWrapper(wrapper);

    expect(wrapper.contains(Child)).toBe(true);
  });
});
