import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { response } from 'express';
import { Col, Card, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import ImageSlider from '../../utils/ImageSlider'
import SearchFeature from './Sections/SearchFeature'
import CheckBox from './Sections/CheckBox'

const { Meta } = Card;

function LandingPage() {
    const [Templates, setTemplates] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [PostSize, setPostSize] = useState(0)
    const [SearchTerm, setSearchTerm] = useState("")
    const [Filters, setFilters] = useState({
        category: [],
        detail: []
    })
    
    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit,
        }

        getTemplates(variables)
    }, [])

    const getTemplates = (variables) => {
        axios.post('/api/template/getTemplates', variables)
            .then(response => {
                if(response.data.success) {
                    if(variables.loadMore) {
                        setTemplates([...Templates, ...response.data.templates])
                    } else {
                        setTemplates(response.data.templates)
                    }
                    console.log(response.data.templates)
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fetch template data')
                }
            })
    }

    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getTemplates(variables)
    }

    const renderCards = Templates.map((template, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card 
                hoverable={true}
                cover={ <a href={`/template/${template._id}`}>
                <ImageSlider images={template.images} /></a>}
            > 
                <Meta
                    title={template.title}
                    description={template.nickname}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getTemplates(variables)
        setSkip(0)
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}

        newFilters[category] = filters
        
        if(category === "detail") {

        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSeachTerm = (newSearchTerm) => {
        
        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)

        getTemplates(variables)

    }

    return (
        <div style ={{ width: '75%', margin:'3rem auto' }}>
            <div style ={{ textAlign: 'center' }}>
                <h2>모든 속지</h2>
            </div>

            {/* Filter */}
            <CheckBox 
                handleFilters={filters => handleFilters(filters, "category")}
            />
            {/* Search */}
            <div style={{ display:'flex', justifyContent:'flex-end', margin:'1rem auto' }}>
                <SearchFeature
                    refreshFunction={updateSeachTerm} //검색어 입력시 자동으로 결과 페이지 보여줌
                />
            </div>

            <br/>
            {Templates.length === 0 ?
                <div style ={{ display: 'flex', height:'300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No post yet...</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br /><br />
            {PostSize >= Limit &&
                <div style ={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }
            
        </div>
    )
}

export default LandingPage