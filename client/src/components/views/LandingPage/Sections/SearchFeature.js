import React, { useState } from 'react'
import { Select, Input } from 'antd';
import '../LandingPage.css'

const { Search } = Input;
const { Option } = Select;

function SearchFeature(props) {
    const [SearchTerm, setSearchTerm] = useState("")
    const [SearchCategory, setSearchCategory] = useState("total")

    const onSearch = (value) => {
        setSearchTerm(value)
        props.refreshFunction(value, SearchCategory)
    }
    const onSearchSelectChange = (value) => {
        setSearchCategory(value)
    }

    return (
        <div>
         
            <Select
                className="Landing-searchFeature-1"
                defaultValue="total"
                onChange={onSearchSelectChange}
            >
                <Option className="Landing-font" value="total">전체</Option>
                <Option className="Landing-font" value="title">제목</Option>
                <Option className="Landing-font" value="designer">작가</Option>
                <Option className="Landing-font" value="nickname">작성자</Option>

            </Select>

            <Search
                className="Landing-searchFeature-2"
                allowClear
                enterButton
                onSearch={onSearch}
                placeholder="Search By Typing..."
            />
        </div>
    )
}

export default SearchFeature
