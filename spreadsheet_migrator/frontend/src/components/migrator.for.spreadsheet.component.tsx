import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import useStyles from "../styles";
import SpreadsheetMigratorService from "../spreadsheet.migrator.service";
import {CellLocation, Column, DefaultCellTypes, Id, ReactGrid, Row} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import readXlsxFile from 'read-excel-file'
import AttachmentButtonSpreadSheets from "./attachment_button_spreadsheets";
import {IconButton, InputAdornment} from "@mui/material";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import project from "./models.interfaces"
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";
import {Row as RowReadExcelFile} from 'read-excel-file'

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    selectedProject: project | undefined;
    setSelectedProject: (proj: project | undefined) => void
}

const MigratorForSpreadSheet: React.FC<Props> = ({
                                                     show,
                                                     setShow,
                                                     selectedProject,
                                                     setSelectedProject
                                                 }) => {

    const classes = useStyles()
    const [filesSelected, setFilesSelected] = React.useState<File[]>([])

    const [columnSuiteName, setColumnSuiteName] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [lackColumnSuiteName, setLackColumnSuiteName] = useState(false)
    const [columnSuiteDescription, setColumnSuiteDescription] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [countOfSelectedSuiteCol, setCountOfSelectedSuiteCol] = useState(0)

    const [columnCaseName, setColumnCaseName] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [lackColumnStepName, setColumnLackStepName] = useState(false)
    const [columnStepName, setColumnStepName] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [lackColumnStepScenario, setColumnLackStepScenario] = useState(false)
    const [columnStepScenario, setColumnStepScenario] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [lackColumnStepExpected, setColumnLackStepExpected] = useState(false)
    const [columnStepExpected, setColumnStepExpected] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [countOfSelectedStepCol, setCountOfSelectedStepCol] = useState(0)

    const [lackColumnCaseName, setLackColumnCaseName] = useState(false)
    const [columnScenarioCase, setColumnScenarioCase] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [lackColumnScenarioCase, setLackColumnScenarioCase] = useState(false)
    const [columnDescriptionCase, setColumnDescriptionCase] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [columnSetUp, setColumnSetUp] = useState<{ value: string, number: number | null }>({value: "", number: null})
    const [columnTearDown, setColumnTearDown] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [columnEstimateTimeCase, setColumnEstimateTimeCase] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [countOfSelectedCaseCol, setCountOfSelectedCaseCol] = useState(0)

    const [columnParameters, setColumnParameters] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })

    const [columnNamePlan, setColumnNamePlan] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [lackColumnNamePlan, setLackColumnNamePlan] = useState(false)
    const [columnStartedAtPlan, setColumnStartedAtPlan] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    // const [lackColumnStartedAtPlan, setLackColumnStartedAtPlan] = useState(false)
    const [columnDueDatePlan, setColumnDueDatePlan] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    // const [lackColumnDueDatePlan, setLackColumnDueDatePlan] = useState(false)
    const [columnDescriptionPlan, setColumnDescriptionPlan] = useState<{ value: string, number: number | null }>({
        value: "",
        number: null
    })
    const [countOfSelectedPlanCol, setCountOfSelectedPlanCol] = useState(0)

    const [rows, setRows] = useState<Row []>([])
    const [columns, setColumns] = useState<Column[]>([])
    const [showTable, setShowTable] = useState(false)
    const [loading, setLoading] = useState(false)

    const [serverResponse, setServerResponse] = useState<{ isOk: boolean | undefined, msg: string }>({
        isOk: undefined,
        msg: ""
    })

    const [focusOnElement, setFocusOnElement] = useState("")

    enum TypeOfColumn {
        SuiteName = "columnSuiteName",
        SuiteDescription = "columnDescriptionSuite",
        CaseName = "columnCaseName",
        CaseScenario = "columnScenarioCase",
        CaseDescription = "columnDescriptionCase",
        CaseSetUp = "columnCaseSetUp",
        CaseTearDown = "columnTearDown",
        CaseEstimate = "columnEstimateTimeCase",
        StepName = "columnStepName",
        StepExpected = "columnStepExpected",
        StepScenario = "columnStepScenario",
        Parameters = "columnParameters",
        PlanName = "columnNamePlan",
        PlanDescription = "columnDescriptionPlan",
        PlanStartedAt = "columnStartedAtPlan",
        PlanDueDate = "columnDueDatePlan",
    }

    const suiteColumns = [TypeOfColumn.SuiteName, TypeOfColumn.SuiteDescription]
    const caseColumns = [TypeOfColumn.CaseName, TypeOfColumn.CaseScenario,
        TypeOfColumn.CaseDescription, TypeOfColumn.CaseSetUp, TypeOfColumn.CaseTearDown,
        TypeOfColumn.CaseEstimate]
    const planColumns = [TypeOfColumn.PlanName, TypeOfColumn.PlanDescription,
        TypeOfColumn.PlanStartedAt, TypeOfColumn.PlanDueDate]
    const stepColumns = [TypeOfColumn.StepName, TypeOfColumn.StepScenario,
        TypeOfColumn.StepExpected]


    const handleColumnResize = (ci: Id, width: number) => {
        setColumns((prevColumns) => {
            const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
            const resizedColumn = prevColumns[columnIndex]
            prevColumns[columnIndex] = {...resizedColumn, width}
            return [...prevColumns]
        });
    }

    const fillDatasForTableInUi = (fileRows: RowReadExcelFile[]) => {
        let cellsOfHeader: DefaultCellTypes[] = []
        cellsOfHeader.push({
            type: "header", text: "№",
            nonEditable: true, className: classes.cellInSpreadSheet
        })
        columns.push({columnId: -1, width: 40, resizable: true})
        fileRows[0].forEach((txt, idx) => {
            cellsOfHeader.push({
                type: "header", text: txt !== null ? txt.toString() : (idx + 1).toString(),
                nonEditable: true, className: classes.cellInSpreadSheet
            })
            columns.push({columnId: idx, width: 200, resizable: true})
        })
        rows.push({rowId: "header", cells: cellsOfHeader})
        for (let i = 1; i < fileRows.length; i++) {
            let cellsOfRows: DefaultCellTypes[] = []
            cellsOfRows.push({
                type: "text", text: i.toString(),
                nonEditable: true, className: classes.cellNumberInSpreadSheet
            })
            fileRows[i].forEach((txt) => {
                cellsOfRows.push({
                    type: "text", text: txt !== null ? txt.toString() : "",
                    nonEditable: true
                })
            })
            rows.push({rowId: i, cells: cellsOfRows})
        }
        setShowTable(true)
    }

    const getExtension = (filename: string) => {
        const parts = filename.split('.');
        return parts[parts.length - 1];
    }

    useEffect(() => {
        if (filesSelected.length > 0) {
            const ext = getExtension(filesSelected[0].name)
            if (ext === "xlsx") {
                readXlsxFile(filesSelected[0]).then((fileRows) => {
                    fillDatasForTableInUi(fileRows)
                })
            } else {
                setServerResponse({isOk: false, msg: "Данный формат файлов не поддерживается"})
            }
        }
    }, [filesSelected])

    const resetColumns = () => {
        setColumnSuiteName({value: "", number: null})
        setColumnSuiteDescription({value: "", number: null})
        setCountOfSelectedSuiteCol(0)

        setColumnCaseName({value: "", number: null})
        setColumnScenarioCase({value: "", number: null})
        setColumnDescriptionCase({value: "", number: null})
        setColumnSetUp({value: "", number: null})
        setColumnTearDown({value: "", number: null})
        setColumnEstimateTimeCase({value: "", number: null})
        setCountOfSelectedCaseCol(0)

        setColumnParameters({value: "", number: null})

        setColumnNamePlan({value: "", number: null})
        setColumnStartedAtPlan({value: "", number: null})
        setColumnDueDatePlan({value: "", number: null})
        setColumnDescriptionPlan({value: "", number: null})
        setCountOfSelectedPlanCol(0)

        setColumnStepScenario({value: "", number: null})
        setColumnStepExpected({value: "", number: null})
        setColumnStepName({value: "", number: null})
        setCountOfSelectedStepCol(0)
    }

    const handleClose = () => {
        setShow(false)
        setShowTable(false)
        setRows([])
        setColumns([])
        setFilesSelected([])
        setSelectedProject(undefined)
        setServerResponse({isOk: undefined, msg: ""})
        resetColumns()
    }

    const validateAfterDeletion = (columnName: TypeOfColumn) => {
        if (suiteColumns.includes(columnName)) {
            if (countOfSelectedSuiteCol - 1 === 0) {
                setLackColumnSuiteName(false)
            }
            setCountOfSelectedSuiteCol(prevState => prevState - 1)
        } else if (caseColumns.includes(columnName)) {
            if (countOfSelectedCaseCol - 1 === 0) {
                setLackColumnCaseName(false)
                setLackColumnScenarioCase(false)
            }
            setCountOfSelectedCaseCol(prev => prev - 1)
        } else if (planColumns.includes(columnName)) {
            if (countOfSelectedPlanCol - 1 === 0) {
                setLackColumnNamePlan(false)
                // setLackColumnStartedAtPlan(false)
                // setLackColumnDueDatePlan(false)
            }
            setCountOfSelectedPlanCol(prevState => prevState - 1)
        } else if (stepColumns.includes(columnName)) {
            if (countOfSelectedStepCol - 1 === 0) {
                setColumnLackStepName(false)
                setColumnLackStepScenario(false)
                setColumnLackStepExpected(false)
            }
            setCountOfSelectedStepCol(prevState => prevState - 1)
        }
    }

    const validateColumns = () => {
        let returnedValue = true
        if (countOfSelectedSuiteCol === 0 && countOfSelectedCaseCol === 0
            && countOfSelectedPlanCol === 0 && columnParameters.number === null) {
            setServerResponse({isOk: false, msg: "Выберите столбцы"})
            return false
        }
        if (columnSuiteDescription.number !== null) {
            if (columnSuiteName.number === null) {
                returnedValue = false
                setLackColumnSuiteName(true)
            }
        }
        if (columnDescriptionCase.number !== null || columnSetUp.number !== null
            || columnTearDown.number !== null || columnEstimateTimeCase.number !== null
            || columnCaseName.number !== null || columnScenarioCase.number !== null) {
            if (columnCaseName.number === null) {
                returnedValue = false
                setLackColumnCaseName(true)
            }
            if (columnScenarioCase.number === null && countOfSelectedStepCol === 0) {
                returnedValue = false
                setLackColumnScenarioCase(true)
            }
        }
        if (columnStepName.number !== null || columnStepExpected.number !== null
            || columnStepScenario.number !== null) {
            if (columnStepScenario.number === null) {
                returnedValue = false
                setColumnLackStepScenario(true)
            }
        }
        if (columnNamePlan.number !== null
            || columnStartedAtPlan.number !== null
            || columnDueDatePlan.number !== null
            || columnDescriptionPlan.number !== null) {
            if (columnNamePlan.number === null) {
                returnedValue = false
                setLackColumnNamePlan(true)
            }
            // if (columnStartedAtPlan.number === null) {
            //     returnedValue = false
            //     setLackColumnStartedAtPlan(true)
            // }
            // if (columnDueDatePlan.number === null) {
            //     returnedValue = false
            //     setLackColumnDueDatePlan(true)
            // }
        }
        return returnedValue
    }

    const getColumnNum = (columnObj: number | null) => {
        if (columnObj !== null) {
            return columnObj;
        } else {
            return null
        }
    }

    const generateConfig = () => {
        let config: Record<string, Record<string, number>> = {}
        if (countOfSelectedSuiteCol !== 0) {
            const suiteFieldsColumns: [string, number | null][] = [
                ["name", columnSuiteName.number], ["description", columnSuiteDescription.number]
            ]
            for (const fieldColumn of suiteFieldsColumns) {
                const num = getColumnNum(fieldColumn[1])
                if (num !== null) {
                    if (config["suite"] === undefined) {
                        config["suite"] = {}
                    }
                    config["suite"][fieldColumn[0]] = num
                }
            }
        }

        if (countOfSelectedStepCol !== 0) {
            const stepFieldsColumns: [string, number | null][] = [
                ["name", columnStepName.number],
                ["scenario", columnStepScenario.number],
                ["expected", columnStepExpected.number]
            ]
            for (const fieldColumn of stepFieldsColumns) {
                const num = getColumnNum(fieldColumn[1])
                if (num !== null) {
                    if (config["step"] === undefined) {
                        config["step"] = {}
                    }
                    config["step"][fieldColumn[0]] = num
                }
            }
        }


        if (countOfSelectedCaseCol !== 0) {
            const caseFieldsColumns: [string, number | null][] = [
                ["name", columnCaseName.number], ["scenario", columnScenarioCase.number],
                ["description", columnDescriptionCase.number], ["setup", columnSetUp.number],
                ["teardown", columnTearDown.number], ["estimate", columnEstimateTimeCase.number]
            ]
            for (const fieldColumn of caseFieldsColumns) {
                const num = getColumnNum(fieldColumn[1])
                if (num !== null) {
                    if (config["case"] === undefined) {
                        config["case"] = {}
                    }
                    config["case"][fieldColumn[0]] = num
                }
            }
        }

        if (columnParameters.number !== null) {
            config["parameter"] = {}
            config["parameter"]["group_data"] = columnParameters.number
        }

        if (countOfSelectedPlanCol !== 0) {
            const planFieldsColumns: [string, number | null][] = [
                ["name", columnNamePlan.number], ["description", columnDescriptionPlan.number],
                ["started_at", columnStartedAtPlan.number], ["due_date", columnDueDatePlan.number]
            ]
            for (const fieldColumn of planFieldsColumns) {
                const num = getColumnNum(fieldColumn[1])
                if (num !== null) {
                    if (config["plan"] === undefined) {
                        config["plan"] = {}
                    }
                    config["plan"][fieldColumn[0]] = num
                }
            }
        }
        return config
    }

    const generate = () => {
        if (filesSelected.length > 0 && validateColumns() && selectedProject !== undefined) {
            SpreadsheetMigratorService.getMe().then((response) => {
                const configJson = JSON.stringify(generateConfig())
                setServerResponse({isOk: undefined, msg: ""})
                setLoading(true)
                SpreadsheetMigratorService.generateFromAttachmentExcel(filesSelected[0], configJson,
                    response.data.username, selectedProject.id).then((response) => {
                    setLoading(false)
                    setServerResponse({isOk: true, msg: "report/" + response.data})
                }).catch((err) => {
                    setLoading(false)
                    if (err.response.status === 400 && typeof (err.response.data) === "string") {
                        setServerResponse({isOk: false, msg: err.response.data})
                    } else {
                        setServerResponse({isOk: false, msg: err.message})
                    }
                })
            })
        }
    }

    function addDeleteColumn(columnName: TypeOfColumn,
                             setColumn: (obj: { value: string, number: number | null }) => void,
                             columnValue: { value: string, number: number | null }
    ) {
        if (focusOnElement === columnName || columnValue.number !== null) {
            if (columnValue.number !== null) {
                setColumn({value: "", number: null})
                validateAfterDeletion(columnName)
            }
            setFocusOnElement("")
        } else {
            setFocusOnElement(columnName)
        }
    }

    function getTextField(columnName: TypeOfColumn,
                          setColumn: (obj: { value: string, number: number | null }) => void,
                          columnValue: { value: string, number: number | null },
                          noRequiredColumn: boolean
    ) {
        return (
            <TextField
                sx={{minWidth: "100%"}}
                value={columnValue.value}
                placeholder={focusOnElement === columnName ? "Выберите столбец" : "Установить"}
                error={noRequiredColumn}
                helperText={noRequiredColumn ? "Выберите столбец" : ""}
                variant="standard"
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                disabled={focusOnElement !== columnName && focusOnElement !== ""}
                                onClick={() => {
                                    addDeleteColumn(columnName, setColumn, columnValue)
                                }}>
                                {focusOnElement !== columnName && columnValue.number === null &&
                                    <AddCircleRoundedIcon sx={{color: noRequiredColumn ? "#d32f2f" : ""}}
                                                          fontSize={"small"}/>
                                    || <CancelRoundedIcon sx={{color: noRequiredColumn ? "#d32f2f" : ""}}
                                                          fontSize={"small"}/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />)
    }

    function setColumn(value: string, number: number, setColumn: (value: { value: string, number: number }) => void) {
        setColumn({
            value: value,
            number: number
        })
        setFocusOnElement("")
    }

    function focusColumn(e: CellLocation) {
        if (e.rowId === "header" && Number(e.columnId) >= 0) {
            const valueOfCell = rows[0].cells[Number(e.columnId) + 1]
            if ("text" in valueOfCell) {
                switch (focusOnElement) {
                    case TypeOfColumn.SuiteName: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnSuiteName)
                        setCountOfSelectedSuiteCol(prevState => prevState + 1)
                        if (lackColumnSuiteName) {
                            setLackColumnSuiteName(false)
                        }
                        break
                    }
                    case TypeOfColumn.SuiteDescription: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnSuiteDescription)
                        setCountOfSelectedSuiteCol(prevState => prevState + 1)
                        break
                    }
                    case TypeOfColumn.CaseName: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnCaseName)
                        setCountOfSelectedCaseCol(prev => prev + 1)
                        if (lackColumnCaseName) {
                            setLackColumnCaseName(false)
                        }
                        break
                    }
                    case TypeOfColumn.CaseDescription: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnDescriptionCase)
                        setCountOfSelectedCaseCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.CaseScenario: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnScenarioCase)
                        setCountOfSelectedCaseCol(prev => prev + 1)
                        if (lackColumnScenarioCase) {
                            setLackColumnScenarioCase(false)
                        }
                        break
                    }
                    case TypeOfColumn.CaseSetUp: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnSetUp)
                        setCountOfSelectedCaseCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.CaseTearDown: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnTearDown)
                        setCountOfSelectedCaseCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.CaseEstimate: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnEstimateTimeCase)
                        setCountOfSelectedCaseCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.Parameters: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnParameters)
                        break
                    }
                    case TypeOfColumn.PlanName: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnNamePlan)
                        setCountOfSelectedPlanCol(prev => prev + 1)
                        if (lackColumnNamePlan) {
                            setLackColumnNamePlan(false)
                        }
                        break
                    }
                    case TypeOfColumn.PlanDescription: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnDescriptionPlan)
                        setCountOfSelectedPlanCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.PlanStartedAt: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnStartedAtPlan)
                        setCountOfSelectedPlanCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.PlanDueDate: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnDueDatePlan)
                        setCountOfSelectedPlanCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.StepName: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnStepName)
                        setCountOfSelectedStepCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.StepScenario: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnStepScenario)
                        setCountOfSelectedStepCol(prev => prev + 1)
                        break
                    }
                    case TypeOfColumn.StepExpected: {
                        setColumn(valueOfCell.text, Number(e.columnId), setColumnStepExpected)
                        setCountOfSelectedStepCol(prev => prev + 1)
                        break
                    }
                }
            }
        }
        return true
    }

    return (<Dialog
        disableEnforceFocus
        open={show && selectedProject !== undefined}
        onClose={handleClose}
        classes={{paper: classes.paperGenerationDatas}}
    >
        <Grid
            style={{
                display: "flex"
            }}
        >
            <Grid container style={{
                position: "absolute",
                height: "100%",
                width: "100%"
            }}>
                <Grid xs={9} item style={{maxHeight: "90%", padding: "11px 20px 15px 20px"}}>
                    <Grid>
                        {selectedProject !== undefined && <Typography variant="h6">
                            {"Перенос данных из таблицы в " + '"' + selectedProject.name + '"'}
                        </Typography>}
                    </Grid>
                    <Grid
                        style={{
                            maxHeight: "75%",
                            overflowY: "scroll",
                            width: "max-content",
                            maxWidth: "99%",
                            margin: "10px 0px 15px 0px",
                        }}>
                        {showTable && <ReactGrid
                            onColumnResized={handleColumnResize}
                            horizontalStickyBreakpoint={90}
                            verticalStickyBreakpoint={90}
                            rows={rows} columns={columns}
                            enableColumnSelection onFocusLocationChanging={(e) => focusColumn(e)}/>}
                    </Grid>
                    {serverResponse.isOk !== undefined && (serverResponse.isOk &&
                        <Paper sx={{
                            margin: 2,
                            padding: 1.5,
                            backgroundColor: "rgba(108,206,49,0.72)"
                        }}>
                            <Link sx={{fontSize: 18, color: "rgb(12,112,226)"}} component="button" onClick={() => {
                                window.open(serverResponse.msg, '_blank')
                            }}>Открыть отчет
                            </Link>
                        </Paper> ||
                        <Paper sx={{
                            margin: 2,
                            padding: 1.5,
                            backgroundColor: "rgba(234,44,44,0.72)"
                        }}>{serverResponse.msg}</Paper>)}
                    {loading && <Box sx={{marginLeft: 70, marginTop: 5}}>
                        <CircularProgress size={60}/>
                    </Box>}
                </Grid>
                <Grid xs={3} item style={{
                    backgroundColor: "#eeeeee", paddingTop: 11, display: "flex",
                    flexDirection: "column", justifyContent: "space-between"
                }}>
                    <Grid style={{marginLeft: 15}}>
                        <AttachmentButtonSpreadSheets setFilesSelected={setFilesSelected} setRows={setRows}
                                                      setColumns={setColumns} setShowTable={setShowTable}
                                                      setServerResponse={setServerResponse}
                                                      resetColumns={resetColumns}
                        />
                        <hr className={classes.delimGenerationFromTable}/>
                        <Typography fontWeight={600} fontSize={18} sx={{marginLeft: "10px"}}>
                            Сьюта
                        </Typography>
                        <Grid sx={{display: "flex"}}>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Имя *
                                </Typography>
                                {getTextField(TypeOfColumn.SuiteName, setColumnSuiteName, columnSuiteName, lackColumnSuiteName)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Описание
                                </Typography>
                                {getTextField(TypeOfColumn.SuiteDescription, setColumnSuiteDescription, columnSuiteDescription, false)}
                            </Grid>
                        </Grid>
                        <hr className={classes.delimGenerationFromTable}/>
                        <Typography fontWeight={600} fontSize={18} sx={{marginLeft: "10px"}}>
                            Тест-кейс
                        </Typography>
                        <Grid sx={{display: "flex"}}>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Имя *
                                </Typography>
                                {getTextField(TypeOfColumn.CaseName, setColumnCaseName, columnCaseName, lackColumnCaseName)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Сценарий (* Если нет шагов)
                                </Typography>
                                {getTextField(TypeOfColumn.CaseScenario, setColumnScenarioCase, columnScenarioCase, lackColumnScenarioCase)}
                            </Grid>
                        </Grid>
                        <Grid sx={{display: "flex"}}>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Описание
                                </Typography>
                                {getTextField(TypeOfColumn.CaseDescription, setColumnDescriptionCase, columnDescriptionCase, false)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Подготовка
                                </Typography>
                                {getTextField(TypeOfColumn.CaseSetUp, setColumnSetUp, columnSetUp, false)}
                            </Grid>
                        </Grid>
                        <Grid sx={{display: "flex"}}>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Очистка
                                </Typography>
                                {getTextField(TypeOfColumn.CaseTearDown, setColumnTearDown, columnTearDown, false)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Время выполнения
                                </Typography>
                                {getTextField(TypeOfColumn.CaseEstimate, setColumnEstimateTimeCase, columnEstimateTimeCase, false)}
                            </Grid>
                        </Grid>
                        <hr className={classes.delimGenerationFromTable}/>
                        <Typography fontWeight={600} fontSize={18} sx={{marginLeft: "10px"}}>
                            Шаги тест кейсов
                        </Typography>
                        <Grid sx={{display: "flex"}}>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Step name
                                </Typography>
                                {getTextField(TypeOfColumn.StepName, setColumnStepName, columnStepName, lackColumnStepName)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Scenario *
                                </Typography>
                                {getTextField(TypeOfColumn.StepScenario, setColumnStepScenario, columnStepScenario, lackColumnStepScenario)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Expected
                                </Typography>
                                {getTextField(TypeOfColumn.StepExpected, setColumnStepExpected, columnStepExpected, false)}
                            </Grid>
                        </Grid>
                        <hr className={classes.delimGenerationFromTable}/>
                        <Typography fontWeight={600} fontSize={18} sx={{marginLeft: "10px"}}>
                            Тест-план
                        </Typography>
                        <Grid sx={{display: "flex"}}>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Имя *
                                </Typography>
                                {getTextField(TypeOfColumn.PlanName, setColumnNamePlan, columnNamePlan, lackColumnNamePlan)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Описание
                                </Typography>
                                {getTextField(TypeOfColumn.PlanDescription, setColumnDescriptionPlan, columnDescriptionPlan, false)}
                            </Grid>
                        </Grid>
                        <Grid sx={{display: "flex"}}>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Время начала
                                </Typography>
                                {getTextField(TypeOfColumn.PlanStartedAt, setColumnStartedAtPlan, columnStartedAtPlan, false)}
                            </Grid>
                            <Grid className={classes.divForFieldColumn}>
                                <Typography fontWeight={600} fontSize={14}>
                                    Время окончания
                                </Typography>
                                {getTextField(TypeOfColumn.PlanDueDate, setColumnDueDatePlan, columnDueDatePlan, false)}
                            </Grid>
                        </Grid>
                        <hr className={classes.delimGenerationFromTable}/>
                        <Grid className={classes.divForFieldColumn}>
                            <Typography fontWeight={600} fontSize={14}>
                                Параметры
                            </Typography>
                            {getTextField(TypeOfColumn.Parameters, setColumnParameters, columnParameters, false)}
                        </Grid>
                        <hr className={classes.delimGenerationFromTable}/>
                    </Grid>
                    <Grid style={{textAlign: "center"}}>
                        <Grid>
                            <Button
                                onClick={handleClose} style={{
                                margin: "0px 4px 20px 5px",
                                width: "45%",
                                minWidth: 100,
                                height: "45%",
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                            }}
                            >
                                Отменить
                            </Button>
                            <Button
                                onClick={generate}
                                style={{
                                    margin: "0px 5px 20px 4px",
                                    width: "45%",
                                    minWidth: 100,
                                    height: "45%",
                                    backgroundColor: "#696969",
                                    color: "#FFFFFF",
                                }}
                            >
                                Сгенерировать
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Dialog>)
}

export default MigratorForSpreadSheet