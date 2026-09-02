const router = require('express').Router();
const publicRouter = require("./public.routes");
const protectedRouter = require("./protected.routes");
const adminRouter = require("./admin.routes");
const unknownRouter = require("./unknown.routes");
const httpAuthFilter = require("../filters/auth.filter");


router.use("/protected", httpAuthFilter, protectedRouter);
router.use("/admin", httpAuthFilter, adminRouter);
router.use("/public", publicRouter);
router.use("/*", unknownRouter);

module.exports = router;