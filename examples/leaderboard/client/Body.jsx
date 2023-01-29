import React from 'react';
import Leaderboard from './Leaderboard.jsx';

function Body() {
    return (
        <div className="app">
            <div className="outer">
                <div className="logo"></div>
                <h1 className="title">Leaderboard</h1>
                <div className="subtitle">
                    Select a scientist to give them points
                </div>
                <Leaderboard />
            </div>
        </div>
    );
}

export default Body;
