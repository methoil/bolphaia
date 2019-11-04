import * as React from 'react';

export default function Square(props: any) {
    return (
        <button className={`square ${props.shade}`}
            onClick={props.onClick}
        // style={props.style}
        >
        </button>
    );
}