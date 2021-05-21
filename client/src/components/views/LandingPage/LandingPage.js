import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { response } from 'express';
import { Col, Card, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import ImageSlider from '../../utils/ImageSlider'
import SearchFeature from './Sections/SearchFeature'
import SortFeature from './Sections/SortFeature'
import CheckBox from './Sections/CheckBox'
import BreadCrumb from './Sections/BreadCrumb'
import { styles } from './Sections/Datas';

const { Meta } = Card;

function LandingPage(props) {
    const [Templates, setTemplates] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [SearchTerm, setSearchTerm] = useState("")
    const [SearchField, setSearchField] = useState("")
    const [SortBy, setSortBy] = useState("createdAt")
    const [Filters, setFilters] = useState({
        styles: [],
    })
    const [Category, setCategory] = useState(props.match.params.category);
    
    //console.log(Category)

    useEffect(() => {

        const variables = {
            category: Category,
            skip: Skip,
            limit: Limit,
            sortBy: SortBy,
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
            category: Category,
            skip: skip,
            limit: Limit,
            filters: Filters,
            sortBy: SortBy,
            loadMore: true,
            searchTerm: SearchTerm,
            searchField: SearchField
        }

        getTemplates(variables)
        setSkip(skip)
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
            category: Category,
            skip: 0,
            limit: Limit,
            filters: filters,
            sortBy: SortBy,
            searchTerm: SearchTerm,
            searchField: SearchField
        }

        console.log(filters)
        
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

    const updateSearchTerm = (newSearchTerm, searchField) => {
        
        const variables = {
            category: Category,
            skip: 0,
            limit: Limit,
            filters: Filters,
            sortBy: SortBy,
            searchTerm: newSearchTerm,
            searchField: searchField
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        setSearchField(searchField)

        getTemplates(variables)
    }

    const showSortedResults = (sortBy) => {
        const variables = {
            category: Category,
            skip: 0,
            limit: Limit,
            filters: Filters,
            sortBy: sortBy,
            searchTerm: SearchTerm,
            searchField: SearchField
        }

        setSkip(0)
        setSortBy(sortBy)

        getTemplates(variables)
    }

    return (
        <div style ={{ width: '75%', margin:'3rem auto' }}>
            <div style ={{ textAlign: 'center' }}>
                <BreadCrumb page = {Category}/>
            </div>

            {/* Filter */}
            <CheckBox list={styles} 
                handleFilters={filters => handleFilters(filters, "styles")} 
            />  
            {/* Search */}
            <Row>
            <Col style={{ display:'flex', justifyContent:'flex-end', margin:'1rem auto 1rem 0' }}>
                <SearchFeature
                    refreshFunction={updateSearchTerm} //검색어 입력시 자동으로 결과 페이지 보여줌
                />
            </Col>

            <Col style={{ display:'flex', justifyContent:'flex-end', margin:'1rem 0 1rem auto' }}>
                <SortFeature
                    sortFunction = {showSortedResults} 
                />
            </Col>
            </Row>
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