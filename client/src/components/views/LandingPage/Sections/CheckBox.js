import React, {useState} from 'react';
import { Checkbox, Collapse } from 'antd';

const {Panel} = Collapse

const category = [
    {
        "_id": 1,
        "name": "다이어리"
    },
    {
        "_id": 2,
        "name": "플래너"
    },
    {
        "_id": 3,
        "name": "트래커"
    },
    {
        "_id": 4,
        "name": "노트"
    },
]

function CheckBox(props) {
    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {
        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];

        if(currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => category.map((value, index) => (
        <React.Fragment key={index}>
                            <Checkbox 
                                onChange={()=>handleToggle(value._id)}
                                type="checkbox"
                                checked={Checked.indexOf(value._id) === -1 ? false : true}
                            />
                            <span>{value.name}</span>
                        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
