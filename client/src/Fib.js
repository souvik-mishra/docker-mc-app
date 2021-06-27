import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Fib(){
    const [seenIndices, setSeenIndices] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    async function fetchValues(){
        const currentValues = await axios.get('/api/values/current');
        setValues(currentValues.data);
    };

    async function fetchIndexes(){
        const seenIndicesList = await axios.get('/api/values/all');
        setSeenIndices(seenIndicesList.data);
    };

    async function handleSubmit(event){
        event.preventDefault();
        await axios.post('/api/values', {
            index
        });
        setIndex('');
    };

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    },[]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input 
                    value={index}
                    onChange={ event => setIndex(event.target.value)}
                />
                <button>Submit</button>
            </form>

            <h3>Indices I have seen:</h3>
            {
                seenIndices.map(({ number }) => number).join(', ')
            }

            <h3>Calculated Values:</h3>
            {
                Object.keys(values).map( key  => <div key={key}>For index {key} I calculated the value {values[key]}</div>)
            }
        </div>
    );
}

export default Fib;