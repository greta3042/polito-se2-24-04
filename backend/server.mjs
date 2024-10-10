import ServiceDao from './dao/service.mjs';
import cors from'cors';
import express from 'express';

const app = express();
const serviceDao = new ServiceDao();
const PORT = 3001;
//const io = require('socket.io')(app);

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
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
    if (!result) {
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


// Call next customer API
app.post('/api/callNextCustomer', async (req, res) => {
  try {
      const { counterId } = req.body; 
      const cId  = req.body;
      if (!counterId) {
          return res.status(400).json({ error: 'Missing counterId' });
      }

      const result = await serviceDao.callNextCustomer(counterId);  
      if (result.error) {
          res.status(404).json(result);
      } else {
          // Sends a notification to React client before resolving
          io.emit('nextCustomer', {
            counterId: cId,
            service: result.name,
            customerNumber: result.nextCustomerNumber
          });
          res.json({ message: result });
      }
  } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/callNextCustomer', async (req, res) => {
  try {
      const { serviceName } = req.body; 
      if (!serviceName) {
          return res.status(400).json({ error: 'Missing serviceName' });
      }

      const result = await serviceDao.callNextCustomer(serviceName);  
      if (result.error) {
          res.status(404).json(result);
      } else {
          res.json({ message: result });
      }
  } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/addService', async (req, res) => {
  const { name, serviceTime } = req.body;
  
  if (!name || !serviceTime) {
      return res.status(400).json({ error: 'name and serviceTime are required' });
  }

  try {
      const result = await serviceDao.addService(name, serviceTime);
      res.status(201).json({ message: 'Service added successfully', serviceId: result });
  } catch (err) {
      if (err.message.includes("UNIQUE constraint")) {
          res.status(409).json({ error: 'Service name must be unique' });
      } else {
          res.status(500).json({ error: 'Internal server error' });
      }
  }
});


/* ACTIVATING THE SERVER */
let server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server }