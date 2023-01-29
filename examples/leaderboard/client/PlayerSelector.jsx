import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

function PlayerSelector({ selectedPlayer, onAddPoints }) {
    var node;

    if (selectedPlayer) {
        node = (
            <div className="details">
                <div className="name">{selectedPlayer.data.name}</div>
                <button className="inc" onClick={onAddPoints}>
                    Add 5 points
                </button>
            </div>
        );
    } else {
        node = <div className="message">Click a player to select</div>;
    }

    return node;
}

PlayerSelector.propTypes = {
    selectedPlayer: PropTypes.object,
};

export default PlayerSelector;

// module.exports = PlayerSelector;
