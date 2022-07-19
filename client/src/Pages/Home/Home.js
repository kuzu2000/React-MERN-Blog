import './Home.css';
import React, { useState, useEffect } from 'react';
import { publicRequest, userRequest } from '../../redux/requestMethod';
import { useSelector } from 'react-redux';
import Nav from '../../Component/Nav/Nav';
import Sidebar from '../../Component/Sidebar/Sidebar';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../../firebase';

const Home = ({ children, setPosts }) => {
  const [popupActive, setPopupActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(false);

  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const userId = currentUser?.user._id;

  useEffect(() => {
    const getCategories = async () => {
      const res = await publicRequest.get('/posts/trending');
      setCategories(res.data);
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getPopularPosts = async () => {
      const res = await publicRequest.get('/posts/top3posts');
      setPopularPosts(res.data);
    };
    getPopularPosts();
  }, []);

  const addPost = () => {
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // htmlFor instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          const postInfo = { title, category, description, photo: url };
          userRequest
            .post(`/posts/create`, postInfo)
            .then((res) => {
              setPosts((prev) => {
                return [...prev, res.data];
              });
              window.location.reload();
            })
            .catch((err) => {
              setShowError(true);
              setErrorMessage(err.response.data.message);
            });
        });
      }
    );
  };

  return (
    <>
      <div className="grid">
        <Nav
          popupActive={popupActive}
          setPopupActive={setPopupActive}
          userId={userId}
        />
        {children}
        <Sidebar categories={categories} popularPosts={popularPosts} />
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            &times;
          </div>
          <div className="content">
            <h3>Add Post</h3>
            {showError && <span style={{ color: 'red' }}>{errorMessage}</span>}
            <input
              type="text"
              className="add-todo-input"
              name="title"
              placeholder="Enter title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              className="add-todo-input"
              name="category"
              placeholder="Enter category"
              onChange={(e) => setCategory(e.target.value)}
            />
            <textarea
              className="add-todo-input"
              name="description"
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="file"
              className="add-todo-input"
              name="photo"
              placeholder="Enter file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="button" onClick={addPost}>
              Create Post
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Home;
