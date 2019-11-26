import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import Item from '../components/Item';

const fakeItem = {
  id: '123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool',
  image: 'image.jpg',
  largeImage: 'largeImage.jpg',
};

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('renders and displays properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />);

    const priceTag = wrapper.find('PriceTag');

    expect(priceTag.text()).toEqual('$50');
    expect(wrapper.find('Title a').text()).toEqual(fakeItem.title);

    const img = wrapper.find('img');

    expect(img.props().src).toEqual(fakeItem.image);
    expect(img.props().alt).toEqual(fakeItem.title);
  });

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />);

    const buttonList = wrapper.find('.buttonList');

    expect(buttonList.children()).toHaveLength(3);

    expect(buttonList.find('Link')).toHaveLength(1);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
