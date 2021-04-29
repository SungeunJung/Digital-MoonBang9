import React, { useState } from 'react'
import { Select, Input } from 'antd';

const { Search } = Input;
const { Option } = Select;

function SearchFeature(props) {
    const [SearchTerm, setSearchTerm] = useState("")
    const [SearchCategory, setSearchCategory] = useState("total")

    const onSearch = (value) => {
        setSearchTerm(value)
        console.log(`Search Category ${SearchCategory}`);
        props.refreshFunction(value)
    }
    const onSearchSelectChange = (value) => {
        //console.log(`selected ${value}`);
        setSearchCategory(value)
    }

    return (
        <div>
         
            <Select
                defaultValue="total"
                style={{ width: 100 }}
                onChange={onSearchSelectChange}
            >
                <Option value="total">전체</Option>
                <Option value="title">제목</Option>
                <Option value="designer">작가</Option>
                <Option value="writer">작성자</Option>

            </Select>

            <Search
                allowClear
                enterButton
                onSearch={onSearch}
                placeholder="Search By Typing..."
                style={{ width: 200 }}
            />
        </div>
    )
}

export default SearchFeature
