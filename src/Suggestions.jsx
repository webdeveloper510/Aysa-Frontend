import React from 'react';
import './search.scss';
import PropTypes from 'prop-types';

export default function Suggestions(props) {
  const {
    suggestions, suggestionIndex, chooseValue, setSuggestionIndex,
  } = props;
  let { order } = props;

  const mouseEvent = (e) => {
    setSuggestionIndex(Number(e.target.id));
  };

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    <div>
      <div className='search-beginning'>

      </div>
      {suggestions.map((suggestion) => {
        const ownOrder = order;
        order += 1;
        return (
          <p
            className={ownOrder === suggestionIndex ? 'active' : 'not-active'}
            key={suggestion.product_id + " " + suggestion.version}
            id={ownOrder}
            onClick={chooseValue(suggestion.product_id, suggestion.version)}
            onMouseEnter={mouseEvent}
          >
            {suggestion.version === "default" ? suggestion.company.concat(" ").concat(suggestion.product):suggestion.company.concat(" ").concat(suggestion.product).concat(" ").concat(suggestion.version )}
          </p>
        );
      })}
    </div>
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
  );
}

Suggestions.propTypes = {
  chooseValue: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  setSuggestionIndex: PropTypes.func.isRequired,
  suggestionIndex: PropTypes.number,
  order: PropTypes.number,
};

Suggestions.defaultProps = {
  suggestions: [],
  suggestionIndex: 0,
  order: 0,
};
