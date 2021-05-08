import React, { useState } from 'react'
import { Select } from 'antd';

const { Option } = Select;

function SortFeature(props) {

    const onSortChange = (value) => {
        props.sortFunction(value)
    }

    return (
        <div>
            <Select
                defaultValue="createdAt"
                style={{ width: 100 }}
                onChange={onSortChange}
            >
                <Option value="createdAt">최신순</Option>
                <Option value="title">제목순</Option>
                <Option value="views">인기순</Option>
                <Option value="nickname">작성자순</Option>
                <Option value="likes">좋아요순</Option>

            </Select>
        </div>
    )
}

export default SortFeature
