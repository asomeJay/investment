// InvestmentCalculator.js
import React, {useState} from 'react';
import {
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import {Chart} from 'react-google-charts';
import Box from "@mui/material/Box";

const InvestmentCalculator = () => {
    const [initialMoney, setInitialMoney] = useState('');
    const [investment, setInvestment] = useState('');
    const [additionalPayment, setAdditionalPayment] = useState('monthly');
    const [compounding, setCompounding] = useState('annual');
    const [duration, setDuration] = useState('');
    const [yieldRate, setYieldRate] = useState('');
    const [results, setResults] = useState([]);
    const [chartResults, setChartResults] = useState([]);
    const theme = useTheme();

    const calculateInvestment = (e) => {
        e.preventDefault();
        const data = [['Year', 'Total Money', 'Yield Against Original', 'Yield Rate (%)']];
        const chartData = [['Year', 'Total Money', 'Yield Against Original']];

        let totalMoney = parseFloat(initialMoney);
        const additionalAmount = parseFloat(investment);
        let monthlyYield, annualYield;

        // Define the yield based on the compounding type.
        if (compounding === 'monthly') {
            monthlyYield = Math.pow(1 + parseFloat(yieldRate) / 100, 1 / 12) - 1;
        } else {
            annualYield = parseFloat(yieldRate) / 100;
        }

        // Initialize total contributions with the initial investment.
        let totalContributions = totalMoney;

        for (let year = 1; year <= parseInt(duration); year++) {
            if (compounding === 'annual') {
                // For each month, add the additional payment if the payment frequency is monthly.
                if (additionalPayment === 'monthly') {
                    for (let month = 1; month <= 12; month++) {
                        totalMoney += additionalAmount;
                        totalContributions += additionalAmount;
                    }
                }
                // Apply annual compounding.
                totalMoney *= (1 + annualYield);
            } else {
                // For monthly compounding, update the total money each month.
                for (let month = 1; month <= 12; month++) {
                    if (additionalPayment === 'monthly') {
                        totalMoney += additionalAmount;
                        totalContributions += additionalAmount;
                    }
                    totalMoney *= (1 + monthlyYield);
                }
            }

            let yieldAgainstOriginal = totalMoney - totalContributions;
            // Calculate the yield rate as a percentage.
            let yieldRatePercent = (yieldAgainstOriginal / totalContributions) * 100;
            data.push([`${year}`, totalMoney, yieldAgainstOriginal, yieldRatePercent.toFixed(2)]);
            chartData.push([`${year}`, totalMoney, yieldAgainstOriginal]);


        }
        setChartResults(chartData)
        setResults(data);
    };


    return (
        <Box
            sx={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>

            <Container>
                <Grid container alignItems="center" direction="column" spacing={2}>
                    <Typography marginTop={"100px"} variant="h4">투자 계산기</Typography>
                    <Grid container
                          marginTop={'10px'}
                          alignItems="center"
                          direction="row"
                          justifyContent='center'
                          spacing={2}>
                        <Grid item>
                            <Typography>
                                초기 금액은
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="원금"
                                variant="outlined"
                                value={initialMoney}
                                onChange={(e) => setInitialMoney(e.target.value)}
                                InputProps={{
                                    endAdornment: '만원'
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <Typography>
                                입니다
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item container direction="row" justifyContent="center" alignItems="center">
                        <Grid item xs={1}>
                            <FormControl fullWidth>
                                {/*<InputLabel id="additional-payment-frequency-label">추가 납입 빈도</InputLabel>*/}
                                <Select
                                    labelId="additional-payment-frequency-label"
                                    id="additional-payment-frequency"
                                    value={additionalPayment}
                                    onChange={(e) => setAdditionalPayment(e.target.value)}
                                >
                                    <MenuItem value="monthly">한 달</MenuItem>
                                    <MenuItem value="yearly">1 년</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} marginLeft={'20px'}>
                            <Typography>
                                에 한번씩
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="투자 금액"
                                variant="outlined"
                                value={investment}
                                onChange={(e) => setInvestment(e.target.value)}
                                InputProps={{
                                    endAdornment: '만원'
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={1} marginLeft={'20px'}>
                            을
                        </Grid>
                    </Grid>

                    <Grid item container direction={"row"} justifyContent={"center"} alignItems={"center"}>
                        <Grid item>
                            <TextField
                                label="투자 기한"
                                variant="outlined"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                InputProps={{
                                    endAdornment: '년'
                                }}
                            />
                        </Grid>
                        <Grid item xs={2} marginLeft={'20px'}>
                            동안 투자합니다.
                        </Grid>

                    </Grid>
                    <Grid item>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">복리 설정</FormLabel>
                            <RadioGroup
                                row
                                value={compounding}
                                onChange={(e) => setCompounding(e.target.value)}
                            >
                                <FormControlLabel value="monthly" control={<Radio/>} label="월복리"/>
                                <FormControlLabel value="annual" control={<Radio/>} label="연복리"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <TextField
                            label="수익률"
                            variant="outlined"
                            value={yieldRate}
                            onChange={(e) => setYieldRate(e.target.value)}
                            InputProps={{
                                endAdornment: '%'
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            size={"large"}
                            variant="contained"
                            onClick={calculateInvestment}>계산하기</Button>
                    </Grid>
                    {results.length > 1 && (
                        <>
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={chartResults}
                                options={{
                                    hAxis: {title: 'Year'},
                                    vAxis: {title: 'Total Money'},
                                }}
                            />
                            <TableContainer component={Paper} style={{overflow: 'auto'}}>
                                <Table aria-label="investment results" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{padding: theme.spacing(1)}}>Year</TableCell>
                                            <TableCell align="right" style={{padding: theme.spacing(1)}}>Total
                                                Money</TableCell>
                                            <TableCell align="right" style={{padding: theme.spacing(1)}}>Yield Against
                                                Original</TableCell>
                                            <TableCell align="right" style={{padding: theme.spacing(1)}}>Yield Rate
                                                (%)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {results.slice(1).map((row) => (
                                            <TableRow key={row[0]}>
                                                <TableCell component="th" scope="row"
                                                           style={{padding: theme.spacing(1)}}>
                                                    {row[0]}
                                                </TableCell>
                                                <TableCell align="right" style={{padding: theme.spacing(1)}}>
                                                    {row[1].toFixed(2)} 만원
                                                </TableCell>
                                                <TableCell align="right" style={{padding: theme.spacing(1)}}>
                                                    {row[2].toFixed(2)} 만원
                                                </TableCell>
                                                <TableCell align="right" style={{padding: theme.spacing(1)}}>
                                                    {row[3]}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default InvestmentCalculator;
