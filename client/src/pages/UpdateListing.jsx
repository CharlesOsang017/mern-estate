import { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import {useNavigate , useParams} from 'react-router-dom'

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate()
  const params = useParams()
  const { currentUser } = useSelector((state) => state.user);
  const [imgUploadError, setImgUploadError] = useState(false);
  const [imgLoadingUpload, setImgLoadingUpload] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  // console.log(formData);
  const handleFileUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImgLoadingUpload(true);
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
          setImgLoadingUpload(false);
        })
        .catch((err) => {
          setImgUploadError("Image upload failed (2 mb max per image)");
          setImgLoadingUpload(false);
        });
    } else {
      setImgUploadError("You can only upload 6 images per listing");
      setImgLoadingUpload(false);
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

  const handleImgDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  useEffect(()=>{
    const fetchListing = async ()=>{
      const listingId = params.listingId
      const res = await fetch(`/api/listing/get/${listingId}`)
      const data = await res.json()
      if(data.success === false){
        console.log(data.message)
        return;
      }
      setFormData(data)
    }
    fetchListing()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload atleast one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be less than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            onChange={handleChange}
            value={formData.name}
            type='text'
            placeholder='Name'
            maxLength='62'
            minLength='10'
            required
            className='border p-3 rounded-lg'
            id='name'
          />
          <textarea
            onChange={handleChange}
            value={formData.description}
            placeholder='Description'
            required
            className='border p-3 rounded-lg'
            id='description'
          />
          <input
            onChange={handleChange}
            value={formData.address}
            type='text'
            placeholder='Address'
            required
            className='border p-3 rounded-lg'
            id='address'
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={formData.type === "sale"}
                type='checkbox'
                id='sale'
                className='w-5'
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                type='checkbox'
                id='rent'
                className='w-5'
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                type='checkbox'
                id='parking'
                className='w-5'
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                type='checkbox'
                id='furnished'
                className='w-5'
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                type='checkbox'
                id='offer'
                className='w-5'
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                onChange={handleChange}
                value={formData.bedrooms}
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
                onChange={handleChange}
                value={formData.bathrooms}
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
                onChange={handleChange}
                value={formData.regularPrice}
                min='50'
                max='1000000'
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
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  onChange={handleChange}
                  value={formData.discountPrice}
                  min='0'
                  max='1000000'
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
            )}
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
              {imgLoadingUpload ? "uploading..." : "upload"}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imgUploadError && imgUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className='flex justify-between p-3 border items-center'
                key={url}
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleImgDelete(index)}
                  className='p-3 hover:underline text-red-700 rounded-lg uppercase hover:opacity-95'
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading || imgLoadingUpload} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? "Updating ..." : "Update Listing"}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
