import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

function RecommendPage() {
    return (
        <div style ={{ width: '75%', margin:'3rem auto' }}>
            <div style ={{ textAlign: 'center' }}>
                <Title level={3}>추천속지</Title>
            </div>
        </div>
    )
}

export default RecommendPage
