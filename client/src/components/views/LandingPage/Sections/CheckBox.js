import React, {useState} from 'react';
import { Checkbox, Collapse } from 'antd';

const {Panel} = Collapse

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

    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <div style={{ display:'inline-block', wordBreak: "keep-all" }}>
            <Checkbox 
                onChange={()=>handleToggle(value._id)}
                checked={Checked.indexOf(value._id) === -1 ? false : true}
            />
            <span style={{paddingLeft:'5px', marginRight:'20px'}}>{value.name}</span></div>
        </React.Fragment>
    ))

    return (
        <div style={{ display:'flex',justifyContent:'center'}}>
            <Collapse defaultActiveKey={['0']} className="style-checkbox">
                <Panel header="스타일" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
