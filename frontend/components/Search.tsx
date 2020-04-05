import React, { useRef, ChangeEvent } from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import { useLazyQuery } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import { Item } from '../types';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

function routeToItem(item: Item) {
  if (item) {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id,
      },
    });
  }
}

type SearchItemsData = {
  items: Item[];
};

type SearchItemsVars = {
  searchTerm: string;
};

function Search() {
  const [searchItems, { data, loading }] = useLazyQuery<
    SearchItemsData,
    SearchItemsVars
  >(SEARCH_ITEMS_QUERY);
  const debouncedSearchItems = useRef(
    debounce(
      (searchTerm: string) => searchItems({ variables: { searchTerm } }),
      350
    )
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearchItems(e.target.value);
  };

  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={item => (item ? item.title : '')}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <input
              {...getInputProps({
                type: 'search',
                placeholder: 'Type to search',
                id: 'search',
                className: loading ? 'loading' : '',
                onChange: handleChange,
              })}
            />
            {isOpen && data?.items && (
              <DropDown>
                {data.items.map((item: Item, index: number) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!data.items.length && !loading && (
                  <DropDownItem>Nothing found {inputValue}</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
}

export default Search;
