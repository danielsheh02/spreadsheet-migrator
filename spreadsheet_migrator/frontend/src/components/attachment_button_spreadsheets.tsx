import React from 'react';
import Button from "@mui/material/Button";
import {Chip, Grid} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import useStyles from "../styles";
import {Column, Row} from "@silevis/reactgrid";
import Typography from "@mui/material/Typography";

interface Props {
    setFilesSelected: (files: File[]) => void;
    setRows: (rows: Row []) => void;
    setColumns: (columns: Column[]) => void;
    setShowTable: (show: boolean) => void;
    setServerResponse: (content: { isOk: boolean | undefined, msg: string }) => void;
    resetColumns: () => void
}

const AttachmentButtonSpreadSheets: React.FC<Props> = ({
                                                           setFilesSelected,
                                                           setRows,
                                                           setColumns,
                                                           setShowTable,
                                                           setServerResponse,
                                                           resetColumns
                                                       }) => {
    const [attachments, setAttachments] = React.useState<File[]>()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        setRows([])
        setColumns([])
        setServerResponse({isOk: undefined, msg: ""})
        setShowTable(false)
        resetColumns()
        if (fileList) {
            setFilesSelected(Array.from(fileList));
            setAttachments(Array.from(fileList));
        } else {
            setFilesSelected([]);
            setAttachments([]);
        }
    }

    const onInputClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const element = e.target as HTMLInputElement
        element.value = ''
    }

    const handleDeleteFile = (index: number) => {
        if (attachments) {
            let copyAttach = attachments.slice()
            copyAttach.splice(index, 1)
            setFilesSelected(copyAttach)
            setAttachments(copyAttach)
            setRows([])
            setColumns([])
            setServerResponse({isOk: undefined, msg: ""})
            setShowTable(false)
            resetColumns()
        }
    }
    const classes = useStyles()
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography fontWeight={600} fontSize={14} sx={{marginBottom: 1}}>
                Выберите файл формата .xlsx
            </Typography>
            <label style={{marginBottom: 5}} htmlFor="fileSelection">
                <input
                    style={{display: "none"}}
                    id="fileSelection"
                    name="file"
                    type="file"
                    accept={".xlsx"}
                    onChange={handleFileChange}
                    onClick={onInputClick}
                />
                <Button
                    sx={{
                        backgroundColor: "#e0e0e0",
                        color: "#1d1d1d",
                        "&:hover": {
                            backgroundColor: "#d5d5d5",
                        }
                    }}
                    component="span"
                    variant="contained"
                >
                    Прикрепить файл
                </Button>
            </label>
            <Grid className={classes.stackTags}>
                {attachments && attachments.map((attachment, index) => (
                    <Grid key={index} style={{marginTop: 7}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <DescriptionIcon sx={{marginTop: "4px"}}/>
                            <Chip sx={{maxWidth: "90%"}} key={index} label={attachment.name}
                                  onDelete={() => handleDeleteFile(index)}/>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default AttachmentButtonSpreadSheets