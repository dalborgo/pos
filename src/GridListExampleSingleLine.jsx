import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import config from '../config/config.json';

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%'
        //overflowX: 'auto'
    },
    titleStyle: {
        color: 'white',

    },
    gridTile : {
        border: 'solid 1px lightgray',
        width: '200px',
        height: '200px'
    }
};


function GridListExampleSingleLine (props) {
    let tilesData = props.tables;
    return(
    <div style={styles.root}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <GridList style={styles.gridList} cellHeight={'auto'}>
                {tilesData.map((tile) => (
                    <GridTile
                        key={tile.id}
                        title={tile.value.name}
                        actionIcon={<IconButton><StarBorder color="white"/></IconButton>}
                        titleStyle={styles.titleStyle}
                        titleBackground="linear-gradient(to top, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                        style={styles.gridTile}
                    >
                        <img src={`http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}/${tile.id}/tavolo_vuoto_100`} />
                    </GridTile>
                ))}
            </GridList>
        </MuiThemeProvider>
    </div>
    )
}

export default GridListExampleSingleLine;