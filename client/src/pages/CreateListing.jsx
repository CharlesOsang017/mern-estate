import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [imgUploadError, setImgUploadError] = useState(false);
  const [imgLoadingUpload, setImgLoadingUpload] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  console.log(formData);
  const handleFileUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImgLoadingUpload(true)
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImgUploadError(false);
          setImgLoadingUpload(false)
        })
        .catch((err) => {
          setImgUploadError("Image upload failed (2 mb max per image)");
          setImgLoadingUpload(false)
        });
    } else {
      setImgUploadError("You can only upload 6 images per listing");
      setImgLoadingUpload(false)
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImgDelete = (index) =>{
    setFormData({...formData, imageUrls: formData.imageUrls.filter((url, i)=> i !==index)})
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            maxLength='62'
            minLength='10'
            required
            className='border p-3 rounded-lg'
            id='name'
          />
          <textarea
            placeholder='Description'
            required
            className='border p-3 rounded-lg'
            id='description'
          />
          <input
            type='text'
            placeholder='Address'
            required
            className='border p-3 rounded-lg'
            id='address'
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='' className='w-5' />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='other' className='w-5' />
              <span>Other</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                min='1'
                max='10'
                required
                type='number'
                id='bedrooms'
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                min='1'
                max='10'
                required
                type='number'
                id='bathrooms'
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                min='1'
                max='10'
                required
                type='number'
                id='regularPrice'
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                min='1'
                max='10'
                required
                type='number'
                id='discountPrice'
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2 mt-4'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              type='file'
              accept='image/*'
              multiple
              id='images'
              className='p-3 border border-gray-300 rounded w-full'
            />
            <button
              type='button'
              disabled={imgLoadingUpload}
              onClick={handleFileUpload}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {imgLoadingUpload ? "uploading..." : 'upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imgUploadError && imgUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div className='flex justify-between p-3 border items-center' key={url}>
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button type='button' onClick={() => handleImgDelete(index)} className='p-3 hover:underline text-red-700 rounded-lg uppercase hover:opacity-95'>
                  Delete
                </button>
              </div>
            ))}
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
