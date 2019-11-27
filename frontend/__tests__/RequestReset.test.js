import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import toJSON from 'enzyme-to-json';

import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';
import { updateWrapper } from '../lib/testUtils';

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'test@gmail.com' },
    },
    result: {
      data: { requestReset: { message: 'Success', __typename: 'Message' } },
    },
  },
];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    const form = wrapper.find('form[data-test="form"]');

    expect(toJSON(form)).toMatchSnapshot();
  });

  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    // simulate typing an email
    wrapper.find('input').simulate('change', {
      target: { name: 'email', value: 'test@gmail.com' },
    });

    // submit the form
    wrapper.find('form').simulate('submit');

    await updateWrapper(wrapper);

    expect(wrapper.find('p').text()).toContain(
      'Success! Check your email for a reset link'
    );
  });
});
