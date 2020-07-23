const express = require("express");
const router = express.Router();

const {
  create,
  productById,
  read,
  list,
  listRelated,
  listCategories,
  listBySearch,
  getPhoto,
  remove,
  update,
} = require("../controllers/product");
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/product/:productId", read);
router.get("/products", list);
router.get("/products/categories", listCategories);
router.get("/products/related/:productId", listRelated);
router.get("/product/photo/:productId", getPhoto);
router.post("/products/by/search", listBySearch);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
