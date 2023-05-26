import {makeStyles} from "@mui/styles";


export default makeStyles({
    button: {
        backgroundColor: "#ff0000",
    },
    spreadSheet: {
        color: "#ff0000",
        maxWidth: "50%"
    },
    delimGenerationFromTable: {
        margin: "8px 10px 8px 0px",
        border: "1px dashed",
    },
    divForFieldColumn: {
        margin: "5px 10px 10px 10px",
    },
    cellInSpreadSheet: {
        whiteSpace: "pre-line"
    },
    paperGenerationDatas: {
        minWidth: "94%",
        minHeight: "93%",
    },
    stackTags: {
        maxWidth: "90%",
        maxHeight: 150,
        marginTop: 8,
        overflowY: "auto",
    },
    divSelectionPage: {
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'column',
    },
    divSelectionPageLine: {
        flexDirection: 'row',
        display: 'flex',
        marginTop: 10,
    },
    tableRow: {
        "&:hover": {
            backgroundColor: "#eeeeee",
            cursor: "pointer",
        },
    },
    cellNumberInSpreadSheet: {
        backgroundColor: "#f2f2f2"
    },
})
;
