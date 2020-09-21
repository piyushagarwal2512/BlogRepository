

import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles, withTheme } from '@material-ui/core/styles';
import axios from 'axios'
import {News} from '../News/index';
import {APIS as apis} from '../apis'

    const drawerWidth = 240;

    const Styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
        display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    });

class Blog extends React.Component {

    constructor(props) {
        super(props)
    
        this.state = {
             mobileOpen:false,
             categoryData:[],
             tagsData:[],
             selectedCategory:null,
             selectedTag:null
        }
    }
    
 

//handle the toggle drawer in mobile view
 handleDrawerToggle = () => {
      let mobileOpen=this.state.mobileOpen;
    this.setState({mobileOpen:!mobileOpen});
  };


  componentDidMount(){

    //get all categories
    axios.get(apis._getCategory).then(({data})=>{
    let ctData=data && data.categories && data.categories.length ? data.categories :[]
        this.setState({categoryData:ctData,          
            selectedCategory:ctData && ctData.length && ctData[0].name })
     })

     //get all tags
     axios.get(apis._getTags).then(({data})=>{
        let ctData=data && data.tags && data.tags.length ? data.tags :[]
        this.setState({tagsData:ctData})
     })

  }

  //handle the click of category or tag 
  clickHandler=(element)=>{
     if(element['category'])
     {
      this.setState({selectedCategory:element['category'],selectedTag:null})
     }else
     {
      this.setState({selectedCategory:null,selectedTag:element['tag']})
     }
  }


 render(){
    const { window } = this.props;
    const classes = this.props.classes;
    const theme = this.props.theme;
    const {categoryData,tagsData}=this.state;
    const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={this.handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography style={{textTransform:"capitalize"}} variant="h6" noWrap>
            {`Blog ${!(this.state.selectedCategory ||this.state.selectedTag )?" ": "| " +(this.state.selectedCategory ||this.state.selectedTag)}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
               <div>
      <div className={classes.toolbar} />
      <Typography variant="h6" noWrap>
            Categories
          </Typography>
      <Divider />
      <List>
        {categoryData && categoryData.map((category) => (
          <ListItem button key={category.name} onClick={()=>  {this.clickHandler({category:category.name})}}>
            <ListItemText style={{textTransform:"capitalize"}} primary={category.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="h6" noWrap>
            Tags
          </Typography>
      <Divider />
 
      <List>
      {tagsData && tagsData.map((tag) => (
          <ListItem button key={tag.tag.display_name} onClick={()=>  {this.clickHandler({tag:tag.tag.display_name})}}>
            <ListItemText style={{textTransform:"capitalize"}} primary={tag.tag.display_name} />
          </ListItem>
        ))}
      </List>

    </div>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {/* {drawer} */}
            <div>
      <div className={classes.toolbar} />
      <Typography variant="h6" noWrap>
            Categories
          </Typography>
      <Divider />
 
      <List>
      {categoryData && categoryData.map((category) => (
          <ListItem button key={category.name} onClick={()=>  {this.clickHandler({category:category.name})}}>
            <ListItemText style={{textTransform:"capitalize"}} primary={category.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="h6" noWrap>
            Tags
          </Typography>
      <Divider />
 
      <List>
      {tagsData && tagsData.map((tag) => (
          <ListItem button key={tag.tag.display_name} onClick={()=>  {this.clickHandler({tag:tag.tag.display_name})}}>
            <ListItemText style={{textTransform:"capitalize"}} primary={tag.tag.display_name} />
          </ListItem>
        ))}
      </List>

    </div>
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
               {this.state.selectedCategory && <News item={{category:this.state.selectedCategory}}/>}
               {this.state.selectedTag && <News item={{tag:this.state.selectedTag}}/>}
      </main>
    </div>
  );
    }
}

Blog.propTypes = {
  window: PropTypes.func,
};


export default withTheme(withStyles(Styles)(Blog));