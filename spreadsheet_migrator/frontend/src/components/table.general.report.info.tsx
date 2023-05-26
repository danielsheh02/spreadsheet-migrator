import React from "react";
import {useNavigate} from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import useStyles from "../styles"

interface Props {
    reportMetaDatas: any;
}

const TableGeneralReportInfo: React.FC<Props> = ({reportMetaDatas}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const classes = useStyles()
    const navigate = useNavigate()
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    return (
        <div>
            <div style={{minWidth: 1000}}>
                <Table sx={{border: "solid 1px rgb(224,224,224)"}} size="small">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "#b4b4b4"}}>
                            <TableCell>ID проекта</TableCell>
                            <TableCell>Название проекта</TableCell>
                            <TableCell>Файл</TableCell>
                            <TableCell>Дата</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportMetaDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((reportMetaData: any, index: number) =>
                                <TableRow key={index} className={classes.tableRow}
                                          onClick={() => navigate(reportMetaData.report_file_name)}>
                                    <TableCell>{reportMetaData.project.id}</TableCell>
                                    <TableCell>{reportMetaData.project.name}</TableCell>
                                    <TableCell>{reportMetaData.report_name}</TableCell>
                                    <TableCell>{new Date(reportMetaData.creation_time).toLocaleDateString()}</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={reportMetaDatas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={"Кол-во строк на странице"}
            />
        </div>
    )
}
export default TableGeneralReportInfo