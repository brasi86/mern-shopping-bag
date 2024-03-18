import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaExclamationCircle } from "react-icons/fa";

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUpdateProgress, setImageFileUpdateProgress] = useState(null);
  const [imageFileUpdateError, setImageFileUpdateError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserSuccess(null);
    setUpdateUserError(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Non hai modificato nessun campo.");
      return;
    }

    if (imageUploading) {
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profilo aggiornato con successo");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploading(true);
    /* service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read;
          allow write: if
          request.resource.size < 2 * 1024 * 1024 &&
          request.resource.contentType.matches('image/.*')
        }
      }
    } */
    setImageFileUpdateError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUpdateProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUpdateError("Il file inserito non è un immagine");
        setImageFileUpdateProgress(null);
        setImageFileUrl(null);
        setImageFile(null);
        setImageUploading(false);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageUploading(false);
        });
      }
    );
  };

  const removeAvatar = () => {
    setImageFileUrl(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    );
    setFormData({
      ...formData,
      profilePicture:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    });
  };

  const handleDeleteAccount = async () => {
    setShowModal(false);

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto w-full text-center">
      <h1 className=" my-7 text-4xl">Impostazioni profilo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
        />
        <div
          className={`relative w-32 h-32 self-center overflow-hidden rounded-full cursor-pointer
          ${
            imageFileUpdateProgress &&
            imageFileUpdateProgress < 100 &&
            "opacity-60"
          }`}
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUpdateProgress && (
            <CircularProgressbar
              value={imageFileUpdateProgress || 0}
              text={`${imageFileUpdateProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199), ${imageFileUpdateProgress / 100})`,
                },
              }}
            />
          )}
          <img
            className="rounded-full w-full object-cover"
            src={imageFileUrl || currentUser.profilePicture}
            alt="userPic"
          />
        </div>
        <button
          onClick={removeAvatar}
          className="max-w-fit mx-auto border-none text-black dark:text-gray-400"
        >
          Rimuovi Avatar
        </button>
        {imageFileUpdateError && (
          <Alert color="failure">{imageFileUpdateError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Cambia password"
          onChange={handleChange}
        />
        <Button
          className=" max-w-fit mx-auto"
          type="submit"
          gradientDuoTone="purpleToBlue"
          disabled={loading || imageUploading}
        >
          {loading ? "Aggiornamento" : "Aggiorna dati"}
        </Button>
        {updateUserSuccess && (
          <Alert color="success">{updateUserSuccess}</Alert>
        )}
        {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      </form>

      <button onClick={() => setShowModal(true)} className="mt-5 text-red-500">
        Elimina Account
      </button>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaExclamationCircle className=" w-16 h-16 mx-auto text-red-500 mb-5" />
            <h3 className="mb-5 text-lg dark:text-gray-400">
              Sei sicuro di voler eliminare definitivamente questo account?
            </h3>
            <div className="button flex justify-between">
              <Button onClick={handleDeleteAccount} color="failure">
                Elimina Account
              </Button>
              <Button onClick={() => setShowModal(false)} color="success">
                NO, non voglio
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
