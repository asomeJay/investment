// App.js
import React, {useState} from 'react';
import FinanceDashBoard from "./FinanceDashBoard";
import {Tab, Tabs} from "@mui/material";
import InvestmentCalculator from "./InvestmentCalculator";

function App() {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    return (
        <div>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="은퇴계산기" />
                <Tab label="복리계산기" />
            </Tabs>
            {tabValue === 0 && <FinanceDashBoard/>}
            {tabValue === 1 && <InvestmentCalculator/>}
        </div>
    );
}

export default App;
