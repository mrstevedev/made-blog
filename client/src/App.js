import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Index from "./components/Index";
import Post from "./components/Post";
import Posts from "./components/Posts";
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import AddPost from './components/AddPost';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import useSWR, { mutate } from "swr";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.scss";
import SidebarRight from "./components/SidebarRight";
import User from './components/User';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: '0.4rem',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    height: '92vh'
  },
  paperContent: {
    padding: theme.spacing(1),
    margin: '1rem 1rem 0 1rem',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    height: '91vh'
  },
  title: {
    flexGrow: 1,
  },
  dialogPaper: {
    padding: '3rem 0 0 0',
    width: '600px',
    height : '500px'
},
'@media(min-width: 768px)': {
      container: {
          width: '1200px',
          margin: '0 auto'
      }
  }
}));

function App() {

  const classes = useStyles();

  const [toast, setToastState] = useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
  });
    
    const { vertical, horizontal, open } = toast;
    const CHARACTER_LIMIT = 45;

    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [postName, setPostName] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postTag, setPostTag] = useState('');
    const [postBody, setPostBody] = useState('');
    const [openAddPost, setOpenAddPost] = useState(false);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState({});
  
    const commentCount = comments.filter((comment) => comment.post_id === post.id).length;
  
    const { REACT_APP_API_URL } = process.env;
  
    const { data, error1 } = useSWR(`${ REACT_APP_API_URL }/posts`, (url) => axios(url).then(res => setPosts(res.data.data)));
    const { data2, error2 } = useSWR(`${ REACT_APP_API_URL }/comments`, (url) => axios(url).then(res => setComments(res.data)));

    const handleAddPost = (newState) => {

      if(postName.length === 0) {
        setError(true)
        setErrorMessage({ name: 'Enter a name' })
      } 
      else if(postTitle.length === 0) {
          setError(true)
          setErrorMessage({ title: "Enter a title" });
      }
      else if(postTag.length === 0) {
        setError(true)
        setErrorMessage({ tag: 'Enter a tag' })
      }
      else if(postBody.length === 0) {
       setError(true);
       setErrorMessage({ body: 'Enter a post' })
      }
      else {
       fetch(`${ REACT_APP_API_URL }/addPost`, {
           method: 'POST',
           headers : { 
               'Content-Type': 'application/json',
               'Accept': 'application/json'
           },
           body: JSON.stringify({
               postName,
               postTitle,
               postTag,
               postBody
           })
       }).then(res => res.json())
           .then(data => {
               setOpenAddPost(false);
               setToastState({ open: true, ...newState });
               mutate(`${ REACT_APP_API_URL }/posts`)
           })
           .catch(err => console.log(err));
      }
    }
    
    const handleClickOpen = () => {
      console.log('openAddPost')
      setOpenAddPost(true);
    }

    const handleClose = () => {
      setOpenAddPost(false);
    }

    const handleToastClose = () => {
      setToastState({  ...toast, open: false });
    }

    const handleGetPost = (event, post) => {
      event.preventDefault();

      const listItem = document.querySelectorAll(".MuiList-root a li");

      [].forEach.call(listItem, (el) => {
        el.classList.remove("current");
      });
      
      event.target.classList.add('current');
      
      // setPost(post);
  }

  const handleRemoveCurrent = () => {
    console.log('handleRemoveCurrent ran')
    const listItem = document.querySelectorAll(".MuiList-root a li");

      [].forEach.call(listItem, (el) => {
        el.classList.remove("current");
      });
  }

  return (
    <Fragment>
      <Router>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar
          posts={posts}
          comments={comments}
          count={commentCount}
          handleClickOpen={handleClickOpen}
          handleGetPost={handleGetPost}
          handleRemoveCurrent={handleRemoveCurrent}
        />
        <SidebarRight />
        <Route exact path="/" render={() => <Index 
          posts={posts}
          comments={comments}
          count={commentCount} />} />

        <Route exact path="/post/:title" component={Post} />
        <Route exact path="/posts" component={Posts} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/user" component={User} />
        <Route exact path="/addpost" component={AddPost} />

      <Dialog 
        classes={{ paper: classes.dialogPaper }}
        open={openAddPost} 
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogContent>
        <TextField
            error={!!errorMessage.name}
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth={false}
            variant="outlined"
            onChange={e => setPostName(e.target.value)}
            helperText={
                errorMessage.name
            }
          />
          <TextField
            error={!!errorMessage.title}
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth={false}
            inputProps={{
              maxlength: CHARACTER_LIMIT
            }}
            variant="outlined"
            onChange={e => setPostTitle(e.target.value)}
            helperText={
                errorMessage.title
            }
          />
          <TextField
            error={!!errorMessage.tag}
            label="Tags"
            margin="dense"
            type="text"
            fullWidth
            variant="outlined"
            onChange={e => setPostTag(e.target.value)}
            helperText={
              errorMessage.tag
          }
          />
          <TextField
            error={!!errorMessage.body}
            margin="dense"
            id="body"
            label="Body"
            type="text"
            fullWidth
            variant="outlined"
            onChange={e => setPostBody(e.target.value)}
            helperText={
                errorMessage.body
              }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddPost.bind( this,  { vertical: 'top', horizontal: 'center' } )} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000} 
        onClose={handleToastClose}
        key={vertical + horizontal}>
        <Alert onClose={handleToastClose} severity="success">
            Success! Post submitted
        </Alert>
     </Snackbar>

      </div>
      </Router>
      
    </Fragment>
  );
}

export default App;
