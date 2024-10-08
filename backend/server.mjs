import ServiceDao from './dao/service.mjs';
import cors from'cors';
import express from 'express';

const app = express();
const serviceDao = new ServiceDao();
const PORT = 3000;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

/* API */

/* Get all avaiable services API */
app.get('/api/services', async(req, res) => {
  try{
    const result = await serviceDao.getServices();
    if(result.error)
        res.status(404).json(result);
    else
      res.json(result);
  }catch(err){
    res.status(500).end();
  }
});

/*Get new ticket API*/
app.post('/api/newTicket', async (req, res) => {
  try {
    const { serviceName } = req.body;  // Estrarre il serviceName dal body della richiesta
    if (!serviceName) {
      return res.status(400).json({ error: 'Missing serviceName in request body' });
    }

    const result = await serviceDao.newTicket(serviceName);  // Passiamo il serviceName estratto dal body
    if (result.error) {
        res.status(404).json(result);
    } else {
        res.json({
            //message: 'Ticket created successfully',
            ticket: result
        });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


/* ACTIVATING THE SERVER */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});