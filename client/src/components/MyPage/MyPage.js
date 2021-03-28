import React, { useEffect } from 'react';
import axios from 'axios';
//import { response } from 'express';
import { withRouter } from 'react-router-dom';

function MyPage(props) {


    return (
        <div style ={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: '100%', height: '100vh' }}>
            <h2>MyPage</h2>
        </div>
    )
}

export default withRouter(MyPage)