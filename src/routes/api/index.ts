import express from 'express';
import apiCustomerRouter from './customer';
import apiCertificateRouter from './certificate';
import apiMailRouter from './mail';
import apiTestRouter from './test';

const router = express.Router();

router.use('/customer', apiCustomerRouter);
router.use('/certificate', apiCertificateRouter);
router.use('/mail', apiMailRouter);
router.use('/test', apiTestRouter);

export default router;
