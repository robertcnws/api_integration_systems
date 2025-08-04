

import React from 'react';
import { CSVLink } from 'react-csv';

import { Iconify } from 'src/components/iconify';

const ExportCSV = ({ data, headers, buttonText, docName }) => {

    const csvReport = {
        data,
        headers,
        filename: `${docName}.csv`
    };

    const buttonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 2px',
        backgroundColor: 'none',
        color: 'black',
        textDecoration: 'none',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'background-color 0.3s ease'
    };

    // const handleMouseOver = (e) => {
    //     e.target.style.backgroundColor = '#0bb2d4';
    // };

    // const handleMouseOut = (e) => {
    //     e.target.style.backgroundColor = '#0dcaf0';
    // };

    return (
        <CSVLink
            {...csvReport}
            style={buttonStyle}
            // onMouseOver={handleMouseOver}
            // onMouseOut={handleMouseOut}
        >
            {/* <i className="fas fa-file-csv" /> {buttonText} */}
            <Iconify icon="solar:export-bold" style={{ marginRight: '15px' }}/> {buttonText}
        </CSVLink>
    );
};

export default ExportCSV;
