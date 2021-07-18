import React, {useState, useEffect} from 'react';
import List from './list.component';
import './list-items.styles.scss';

const ListItems = (props) => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch(`/api/categories`, {
            headers: {
                'Authorization': props.token,
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.success) {
                setCategories(response.success);
            } else {
                setCategories([]);
            }
        })
    }, [props.token])

    return (
        <div className="list-items">
        {
            categories.map((item, i) => (
                <List token={props.token} key={i} name={item} />
            ))
        }
        </div>
    );
}

export default ListItems;