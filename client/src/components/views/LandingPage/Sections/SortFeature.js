import React, { useState } from 'react'
import { Select } from 'antd';
import '../LandingPage.css'

const { Option } = Select;

function SortFeature(props) {

    const onSortChange = (value) => {
        props.sortFunction(value)
    }

    return (
        <div>
            <Select
                className="Landing-sortFeature"
                defaultValue="createdAt"
                onChange={onSortChange}
            >
                <Option className="Landing-font" value="createdAt">최신순</Option>
                <Option className="Landing-font" value="title">제목순</Option>
                <Option className="Landing-font" value="views">인기순</Option>
                <Option className="Landing-font" value="nickname">작성자순</Option>
                <Option className="Landing-font" value="likes">좋아요순</Option>

            </Select>
        </div>
    )
}

export default SortFeature
