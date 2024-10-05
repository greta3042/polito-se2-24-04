import ServiceDao from './dao/service.mjs';
import cors from'cors';
import express from 'express';

const app = express();
const serviceDao = new ServiceDao();
const PORT = 3000;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:${PORT}',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

/* API */

/* Get ticket API */
app.get('/api/newTicket', async(req, res) => {
  try{
    const result = await serviceDao.newTicket(req.body.serviceName);
    if(result.error)
        res.status(404).json(result);
    else
      res.json(result);
  }catch(err){
    res.status(500).end();
  }
});

/* ACTIVATING THE SERVER */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});