import React, {useState, useEffect} from 'react';
import List from './list.component';
import './list-items.styles.scss';

const ListItems = () => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch(`/api/categories`)
        .then(response => response.json())
        .then(response => {
            setCategories(response.success);
        })
    }, [])

    return (
        <div className="list-items">
        {
            categories.map((item, i) => (
                <List key={i} name={item} />
            ))
        }
        </div>
    );
}

export default ListItems;