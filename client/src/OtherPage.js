import React from 'react';
import { Link } from 'react-router-dom';

function OtherPage() {
    return (
        <div>
            I'm from other page!
            <Link to="/">HOME</Link>
        </div>
    );
}

export default OtherPage;