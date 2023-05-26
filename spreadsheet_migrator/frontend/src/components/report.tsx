import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SpreadsheetMigratorService from "../spreadsheet.migrator.service";
import TablePagination from '@mui/material/TablePagination';
import Container from "@mui/material/Container";
import useStyles from "../styles";
import TableGeneralReportInfo from "./table.general.report.info";

interface Props2 {
    act_on_obj: string,
    objs: any
}

const TableReportAboutLackDatas: React.FC<Props2> = ({act_on_obj, objs}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            <div style={{margin: "10px 0 10px 0"}}>
                {act_on_obj}
            </div>
            <div style={{minWidth: 1000}}>
                <Table sx={{border: "solid 1px rgb(224,224,224)"}} size="small">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "#b4b4b4"}}>
                            <TableCell>row</TableCell>
                            <TableCell>column</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {objs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: any, index: number) => {
                                return <TableRow key={index}>
                                    <TableCell sx={{minWidth: 60, wordBreak: "break-word"}}>{row.row - 1}</TableCell>
                                    <TableCell sx={{minWidth: 60, wordBreak: "break-word"}}
                                               key={index}>{"[" + row.columns.join(", ") + "]"}</TableCell>
                                </TableRow>
                            })}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={Object.entries(objs).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={"Кол-во строк на странице"}
            />
        </div>
    );
}

interface Props {
    act_on_obj: string,
    objs: any,
    config: any
}

const TableReport: React.FC<Props> = ({act_on_obj, objs, config}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            <div style={{margin: "10px 0 10px 0"}}>
                {act_on_obj}
            </div>
            <div style={{minWidth: 1000}}>
                <Table sx={{border: "solid 1px rgb(224,224,224)"}} size="small">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "#b4b4b4"}}>
                            <TableCell>ID</TableCell>
                            {Object.entries(config).map((columnNameAndNumber, index) => {
                                const [columnName,] = columnNameAndNumber
                                return <TableCell sx={{maxWidth: 250, wordBreak: "break-word"}}
                                                  key={index}>{columnName}</TableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(objs).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: any) => {
                                let valueOfFields: any[] = []
                                valueOfFields.push(row[1].id)
                                Object.entries(config).map((columnNameAndNumber) => {
                                    const [columnName,] = columnNameAndNumber
                                    if (columnName === "name" && row[1].title !== undefined) {
                                        valueOfFields.push(row[1].title)
                                    } else if (columnName === "started_at" || columnName === "due_date") {
                                        valueOfFields.push(new Date(row[1][columnName]).toLocaleString())
                                    } else {
                                        valueOfFields.push(row[1][columnName])
                                    }
                                })
                                return <TableRow key={row[0]}>
                                    {valueOfFields.map((valueOfField, index) => {
                                        if (typeof valueOfField === "string") {
                                            if (valueOfField.length > 100) {
                                                valueOfField = valueOfField.slice(0, 100) + "..."
                                            }
                                        }
                                        return <TableCell sx={{minWidth: 60, wordBreak: "break-word"}}
                                                          key={index}>{valueOfField}</TableCell>
                                    })}
                                </TableRow>
                            })}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={Object.entries(objs).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={"Кол-во строк на странице"}
            />
        </div>
    );
}

const Report = () => {
    const {fileName} = useParams()
    const [report, setReport] = useState<any>(undefined)
    const [reportMetaDatas, setReportMetaDatas] = useState<any[]>([])
    const navigate = useNavigate()
    const classes = useStyles();

    useEffect(() => {
        SpreadsheetMigratorService.getMe().then((response) => {
            if (fileName !== undefined) {
                SpreadsheetMigratorService.get_report(fileName).then((response) => {
                    setReport(response.data)
                }).catch((err) => {
                    if (err.response.status === 404) {
                        navigate("/not-exist")
                    }
                })
            } else {
                SpreadsheetMigratorService.get_reports(response.data.username).then((response) => {
                    let reports = response.data
                    reports.sort(function (a: any, b: any) {
                        const aTime = new Date(a.creation_time)
                        const bTime = new Date(b.creation_time)
                        if (aTime > bTime) {
                            return -1
                        }
                        if (aTime < bTime) {
                            return 1
                        }
                        return 0
                    })
                    setReportMetaDatas(reports)
                    setReport(undefined)
                })
            }
        })
    }, [fileName])

    function getInfo(obj_name: string, obj: any) {
        return (
            <div>
                <Typography variant="h6">
                    {obj_name}
                </Typography>
                {
                    obj.created !== undefined &&
                    <TableReport act_on_obj={"Созданные:"} objs={obj.created} config={obj.config}/>
                }
                {
                    obj.found !== undefined &&
                    <TableReport act_on_obj={"Существующие (не созданы):"} objs={obj.found} config={obj.config}/>
                }
                {
                    obj.lack_data !== undefined &&
                    <TableReportAboutLackDatas
                        act_on_obj={"Ячейки, в которых отсутствовали обязательные поля (объекты не созданы)"}
                        objs={obj.lack_data}/>
                }
                <Divider style={{margin: "15px 0px 15px 0px"}}/>
            </div>
        )
    }

    const preparePlans = (plans: any) => {
        if (plans.config.started_at === undefined) {
            plans.config = {...plans.config, started_at: null}
        }
        if (plans.config.due_date === undefined) {
            plans.config = {...plans.config, due_date: null}
        }
        return getInfo("Тест планы", plans)
    }

    return (
        <div style={{margin: "0 45px 0 45px"}}>
            {report !== undefined && <div style={{padding: 40, wordBreak: "break-word"}}>
                {report.report_name && report.creation_time && <div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Typography variant="h6">
                            Отчет
                        </Typography>
                    </div>
                    <div>
                        {report.report_name}
                    </div>
                    <div>
                        {new Date(report.creation_time).toLocaleString()}
                    </div>
                    <Divider style={{margin: "15px 0px 15px 0px"}}/>
                </div>}
                <div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Typography variant="h6">
                            Проект
                        </Typography>
                    </div>
                    <div>
                        <div>{report.project.name}</div>
                    </div>
                    <Divider style={{margin: "15px 0px 15px 0px"}}/>
                </div>
                {
                    report.suites !== undefined && getInfo("Сьюты", report.suites)
                }
                {
                    report.cases !== undefined && getInfo("Тест-кейсы", report.cases)
                }
                {
                    report.parameters !== undefined && getInfo("Параметры", {
                        created: report.parameters.created,
                        found: report.parameters.found,
                        lack_data: report.parameters.lack_data,
                        config: {
                            group_name: report.parameters.config.group_data,
                            data: report.parameters.config.group_data
                        }
                    })
                }
                {
                    report.plans !== undefined && preparePlans(report.plans)
                }
            </div>}
            {report === undefined &&
                <Container component="main" maxWidth="xl">
                    <div>
                        <div className={classes.divSelectionPageLine}>
                            <Typography variant="h6" sx={{marginTop: 1, marginBottom: 1}}>
                                Выберите отчет:
                            </Typography>
                        </div>
                        <TableGeneralReportInfo reportMetaDatas={reportMetaDatas}/>
                    </div>
                </Container>
            }
        </div>
    );
}
export default Report