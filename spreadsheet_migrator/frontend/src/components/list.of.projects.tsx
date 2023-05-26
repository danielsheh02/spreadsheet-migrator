import React, {useEffect, useState} from "react";
import SpreadsheetMigratorService from "../spreadsheet.migrator.service";
import useStyles from "../styles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MigratorForSpreadSheet from "./migrator.for.spreadsheet.component";
import {useNavigate} from "react-router-dom";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import project from "./models.interfaces"

const ListOfProjects = () => {
    const classes = useStyles();
    const [projects, setProjects] = useState<project[]>([]);
    const [showGenerationFromExcel, setShowGenerationFromExcel] = useState(false)
    const [selectedProject, setSelectedProject] = useState<project | undefined>(undefined);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const navigate = useNavigate()
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    useEffect(() => {
        SpreadsheetMigratorService.getProjects().then((response) =>
            setProjects(response.data)
        )
            .catch((e) => console.log(e));
    }, []);

    return (
        <Container component="main" maxWidth="xl">
            <div>
                <div className={classes.divSelectionPageLine}>
                    <Typography variant="h6" sx={{marginTop: 1, marginBottom: 1}}>
                        Выберите проект, в который необходимо перенести данные:
                    </Typography>
                </div>
                <div>
                    <div style={{minWidth: 1000}}>
                        <Table sx={{border: "solid 1px rgb(224,224,224)"}} size="small">
                            <TableHead>
                                <TableRow sx={{backgroundColor: "#b4b4b4"}}>
                                    <TableCell>ID проекта</TableCell>
                                    <TableCell>Название проекта</TableCell>
                                    <TableCell>Описание проекта</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((project, index: number) =>
                                        <TableRow key={index} className={classes.tableRow}
                                                  onClick={() => {
                                                      setShowGenerationFromExcel(true)
                                                      setSelectedProject(project)
                                                  }}
                                        >
                                            <TableCell  sx={{maxWidth: 250,minWidth: 60, wordBreak: "break-word"}}>{project.id}</TableCell>
                                            <TableCell  sx={{maxWidth: 250,minWidth: 60, wordBreak: "break-word"}}>{project.name}</TableCell>
                                            <TableCell  sx={{maxWidth: 250,minWidth: 60, wordBreak: "break-word"}}>{project.description}</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={projects.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={"Кол-во строк на странице"}
                    />
                </div>
            </div>
            <MigratorForSpreadSheet show={showGenerationFromExcel} setShow={setShowGenerationFromExcel}
                                 selectedProject={selectedProject} setSelectedProject={setSelectedProject}/>
        </Container>
    )
}

export default ListOfProjects
