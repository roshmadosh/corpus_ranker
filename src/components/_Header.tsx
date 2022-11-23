import React from 'react';
import { Link, useHistory } from 'react-router-dom'


export const Header = () => {
    const history = useHistory()


    return (
        <header>
            <nav>
                <div className="header-item"><h1 onClick={() => history.push('/')}>Corpus Ranker</h1></div>
                <Link className="header-item" to={'/about'}>About</Link>
            </nav>
        </header>
    )
}