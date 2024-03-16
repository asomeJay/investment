import React, {useState} from 'react';
import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

function FinanceDashboard() {
    const [income, setIncome] = useState(3000);
    const [savings, setSavings] = useState(300);
    const [roi, setRoi] = useState(6);
    const [expenses, setExpenses] = useState(2700);
    const [yearsData, setYearsData] = useState([]); // [1
    const [savingsRate, setSavingsRate] = useState(10);
    const [retirementYear, setRetirementYear] = useState(0);
    const yearsToShow = 20; // Years to show before and after the retirement
    const [summary, setSummary] = useState()
    // React.useEffect(() => {
    //     setExpenses(parseInt(income - savings))
    // }, [income, savings])
    //
    // React.useEffect(() => {
    //     setSavingsRate((parseFloat(savings / income) * 100).toFixed(2))
    // }, [income, savings])
    //
    // React.useEffect(() => {
    //     setSavings(parseInt(income * parseFloat(savingsRate / 100).toFixed(2)))
    // }, [savingsRate])

    React.useEffect(() => {
        let year = 0;
        let currentSavings = savings;
        let currentYearsData = []
        let temporalRetirementYear = 0
        for (let i = 0; i < 80; i++) {
            let annualRoiIncome = currentSavings * (roi / 100);
            if (annualRoiIncome > expenses) {
                console.log('Retirement year:', year)
                console.log(annualRoiIncome, expenses)
                if (temporalRetirementYear === 0) {
                    temporalRetirementYear = year
                }
            }
            currentYearsData.push({
                year: year,
                currentSavings: currentSavings,
                annualRoiIncome: annualRoiIncome,
                expenses: expenses
            });

            currentSavings += annualRoiIncome + savings;
            year++;
        }
        setRetirementYear(temporalRetirementYear)
        setYearsData([...currentYearsData])
    }, [income, savings, roi, expenses])

    const graphData = React.useMemo(() => {
        if (!retirementYear) return yearsData.slice(0, yearsToShow);
        const startYear = 0;
        const endYear = Math.min(retirementYear + yearsToShow, yearsData.length - 1);
        return yearsData.slice(startYear, endYear + 1);
    }, [retirementYear])

    React.useEffect(() => {
        setSummary(yearsData[retirementYear])
    }, [yearsData, retirementYear])

    return (
        <Container maxWidth={"md"}>
            <Box sx={{marginTop: 4, marginBottom: 4, textAlign: 'center'}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    은퇴계산기
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap'}}>
                    <TextField
                        label="연간 수익 (KRW)"
                        type="number"
                        value={income}
                        onChange={(e) => {
                            let currentIncome = e.target.value
                            setExpenses(currentIncome - savings)
                            setSavingsRate(((savings / currentIncome) * 100).toFixed(2))
                            setIncome(currentIncome)
                        }}
                        variant="outlined"
                        // fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="연간 저축 (KRW)"
                        type="number"
                        value={savings}
                        onChange={(e) => {
                            let saving = e.target.value
                            setSavings(parseFloat(saving))
                            setExpenses(income - saving)
                            setSavingsRate(((saving / income) * 100).toFixed(2))
                        }}
                        variant="outlined"
                        // fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="연간 저축률 (%)"
                        type="number"
                        value={savingsRate}
                        defaultValue={savingsRate}
                        onChange={(e) => {
                            let currentSavingsRate = parseFloat(e.target.value)
                            setSavings(income * (currentSavingsRate / 100))
                            setExpenses(income - income * (currentSavingsRate / 100))
                            setSavingsRate(currentSavingsRate)
                        }}
                        variant="outlined"
                        // fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="연간 지출액 (KRW)"
                        type="number"
                        value={expenses}
                        defaultValue={expenses}
                        onChange={(e) => {
                            let currentExpenses = parseFloat(e.target.value)
                            let currentSavings = income - currentExpenses
                            setExpenses(currentExpenses)
                            setSavings(income - currentExpenses)
                            setSavingsRate(((currentSavings / income) * 100).toFixed(2))
                        }}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        label="투자수익률 (%)"
                        type="number"
                        value={roi}
                        defaultValue={6}
                        onChange={(e) => setRoi(parseFloat(e.target.value))}
                        variant="outlined"
                        // fullWidth
                        margin="normal"
                    />
                </Box>
                {summary !== undefined && (
                    <Box sx={{textAlign: 'left', marginBottom: 4, marginTop: 4}}>
                        {retirementYear > 0 ? (
                            <>
                                <Typography variant="h5">
                                    {retirementYear} 년 후에 은퇴할 수 있습니다.
                                </Typography>
                                <Typography variant="body1">
                                    은퇴 시점에 연간 투자 수익액은 {summary.annualRoiIncome.toFixed()} 원 입니다.
                                </Typography>
                                <Typography variant="body1">
                                    지출금액을 제하고 {(summary.annualRoiIncome - summary.expenses).toFixed()} 원을 저축할 수 있습니다.
                                </Typography>
                                <Typography variant="body1">
                                    연간 지출액은 {summary.expenses.toFixed()} 원 입니다.
                                </Typography>
                                <Typography variant="body1">
                                    누적 저축액은 {summary.currentSavings.toFixed()} 원 입니다.
                                </Typography>
                            </>

                        ) : (
                            <Typography variant="h5">
                                은퇴할 수 없습니다.
                            </Typography>
                        )}

                    </Box>
                )}


                <ResponsiveContainer width="100%" height={400} style={{marginTop: 20}}>
                    <LineChart
                        data={graphData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="year"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="annualRoiIncome" stroke="#82ca9d" name="연간 수익금 (KRW)"/>
                        <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="연간 지출 (KRW)"/>
                        {retirementYear && <ReferenceLine x={retirementYear} stroke="red" label="은퇴"/>}

                    </LineChart>
                </ResponsiveContainer>


                <Table component={Paper} style={{marginTop: 20}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Year</TableCell>
                            <TableCell align="right">저축액 (KRW)</TableCell>
                            <TableCell align="right">연간 수익금 (KRW)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {yearsData.map((row) => (
                            <TableRow key={row.year}>
                                <TableCell component="th" scope="row">
                                    {row.year}
                                </TableCell>
                                <TableCell align="right">{row.currentSavings.toLocaleString()}</TableCell>
                                <TableCell align="right">{row.annualRoiIncome.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Container>

    );
}

export default FinanceDashboard;
