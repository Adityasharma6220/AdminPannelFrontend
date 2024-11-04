import React from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';

const status = [
    { value: 'today', label: 'Today', action: 'setToday' },
    { value: 'yesterday', label: 'Yesterday', action: 'setYesterday' },
    { value: 'lastWeek', label: 'Last Week', action: 'setLastWeek' },
    { value: 'lastTwoDays', label: 'Last Two Days', action: 'setLastTwoDays' },
    { value: 'thisMonth', label: 'This Month', action: 'setThisMonth' },
    { value: 'lastMonth', label: 'Last Month', action: 'setLastMonth' },
];

const DateFilters = () => {
    // Function to get the default start date (first day of last month)
    const getDefaultStartDate = () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return formatDate(lastMonth);
    };

    // Function to format date as "YYYY-MM-DD"
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate] = useState(formatDate(new Date())); // Current date
    const [field, setField] = useState("_id");
    const [sortby, setSortby] = useState(-1);
    const { t } = useTranslation()
    const [value, setValue] = useState('today');

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const sortingMethod = (columnname) => {

        if (columnname !== 'action') {
            setField(columnname);
            setSortby(-sortby); // Toggle between ascending and descending order
        }
    };

    // Date Filter Functions
    const setDateRange = (days) => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - days);

        setStartDate(formatDate(start));
        setEndDate(formatDate(today));
    };

    const setToday = () => {
        const today = new Date();
        setStartDate(formatDate(today));
        setEndDate(formatDate(today));
    };

    const setYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setStartDate(formatDate(yesterday));
        setEndDate(formatDate(yesterday));
    };

    const setLastWeek = () => {
        setDateRange(7);
    };

    const setLastTwoDays = () => {
        setDateRange(2);
    };

    const setThisMonth = () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(formatDate(start));
        setEndDate(formatDate(today));
    };

    const setLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        setStartDate(formatDate(lastMonth));
        setEndDate(formatDate(endOfLastMonth));
    };

    React.useEffect(() => {
        switch (value) {
            case 'today':
                setToday();
                break;
            case 'yesterday':
                setYesterday();
                break;
            case 'lastWeek':
                setLastWeek();
                break;
            case 'lastTwoDays':
                setLastTwoDays();
                break;
            case 'thisMonth':
                setThisMonth();
                break;
            case 'lastMonth':
                setLastMonth();
                break;
            default:
                break;
        }
    }, [value]);

    return (
        <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
            {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                </MenuItem>
            ))}
        </TextField>
    )
}

export default DateFilters