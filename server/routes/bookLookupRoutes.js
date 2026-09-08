import express from "express";
import { lookupByIsbn } from "../controllers/bookLookupController.js";

const router = express.Router();

router.get("/lookup", lookupByIsbn);

export default router;