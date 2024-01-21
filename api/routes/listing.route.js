import express from 'express'
import { createListing ,getListing , getListings ,deleteListing, updateListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express()

router.post('/create', verifyToken ,createListing)
router.delete('/delete/:id', verifyToken ,deleteListing)
router.post('/update/:id', verifyToken ,updateListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)


export default router;