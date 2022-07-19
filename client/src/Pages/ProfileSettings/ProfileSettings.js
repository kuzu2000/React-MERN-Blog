import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update, updateAccount } from '../../redux/api';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../../firebase'
import Home from '../Home/Home';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const [name, setName] = useState(currentUser?.user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);

  const passwordInput = { currentPassword, password, passwordConfirm };
  const handlePasswordChange = (e) => {
    setLoading(true);
    e.preventDefault();
      if (passwordInput) {
        updateAccount(
          dispatch,
          passwordInput,
          currentUser?.user.email,
          currentUser?.user._id
        );
        setLoading(false);
        setSuccess(true);
      }
  };

  const handleNameChange = (e) => {
    setLoading(true);
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            const nameInput = { name, photo: url };
                if (nameInput) {
                  update(
                    dispatch,
                    nameInput,
                    currentUser?.user.email,
                    currentUser?.user._id
                  );
                  setLoading(false);
                  setSuccess(true);
                }
        });
      }
    );
  };

  return (
    <Home>
      <div className="profilePage">
        <h2>Profile</h2>
        <div className="profileType">
          <div className="profileName">
            <h2>YOUR ACCOUNT SETTINGS</h2>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="profilePhoto">
              <img
                src={file ? URL.createObjectURL(file) : currentUser?.user.photo}
                alt={currentUser?.user.name}
              />
              <label htmlFor="fileInput">
                <i className="fa fa-user-circle"></i>
              </label>
              <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                className="profilePhotoInput"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div className="profileButton">
              {loading ? (
                <button disabled={loading}>
                  <i className="fa fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button onClick={handleNameChange}>SAVE SETTINGS</button>
              )}
            </div>
          </div>
          <div className="profilePassword">
            <h2>PASSWORD CHANGE</h2>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              placeholder="••••••••"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <label htmlFor="password">New password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="passwordConfirm">Current Password</label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              placeholder="••••••••"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <div className="profileButton">
              {loading ? (
                <button disabled={loading}>
                  <i className="fa fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button onClick={handlePasswordChange}>SAVE PASSWORD</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Home>
  );
};

export default ProfileSettings;
